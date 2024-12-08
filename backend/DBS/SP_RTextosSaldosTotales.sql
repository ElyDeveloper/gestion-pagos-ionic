USE [Cobros]
GO
/****** Object:  StoredProcedure [dbo].[SP_RTextosSaldosTotales]    Script Date: 27/11/2024 0:36:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[SP_RTextosSaldosTotales]
	-- Add the parameters for the stored procedure here
	@ID_CLIENTE INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @FechaActual AS DATE = GETDATE();
    -- Insert statements for procedure here
-- Consulta principal

WITH SALDOCALCULADO AS (
    SELECT DISTINCT
        p.Id AS idP,
        (FP.Monto - CAST(((P.Monto * (p.TasaInteres / 100)) / pp.CuotasPagar) AS DECIMAL(18, 2))) * 
         (SELECT COUNT(*) FROM FechasPagos WHERE PlanId = PP.Id AND Estado = 0) -
         CASE 
            WHEN ISNULL((SELECT SUM(Monto) FROM PAGOS WHERE IdFechaPago = FP.Id AND Estado = 1), 0) > CAST(((P.Monto * (p.TasaInteres / 100)) / pp.CuotasPagar) AS DECIMAL(18, 2))
                AND FP.Estado = 0
                THEN ((SELECT SUM(Monto) FROM Pagos WHERE IdFechaPago = FP.Id AND FP.Estado = 0) - CAST(((P.Monto * (p.TasaInteres / 100)) / pp.CuotasPagar) AS DECIMAL(18, 2)) )
            ELSE 0
         END AS saldoPtmo,
        ROW_NUMBER() OVER (PARTITION BY p.Id ORDER BY 
            (FP.Monto - CAST(((P.Monto * (p.TasaInteres / 100)) / pp.CuotasPagar) AS DECIMAL(18, 2))) * 
            (SELECT COUNT(*) FROM FechasPagos WHERE PlanId = PP.Id AND Estado = 0) -
            CASE 
                WHEN ISNULL((SELECT SUM(Monto) FROM PAGOS WHERE IdFechaPago = FP.Id AND Estado = 1), 0) > CAST(((P.Monto * (p.TasaInteres / 100)) / pp.CuotasPagar) AS DECIMAL(18, 2))
                    AND FP.Estado = 0
                    THEN ((SELECT SUM(Monto) FROM Pagos WHERE IdFechaPago = FP.Id AND FP.Estado = 0) - CAST(((P.Monto * (p.TasaInteres / 100)) / pp.CuotasPagar) AS DECIMAL(18, 2)) )
                ELSE 0
            END ASC) AS row_num
    FROM Prestamos P 
        JOIN Personas per ON p.IdCliente = per.Id 
        JOIN UsuarioCliente UC ON P.IdCliente = UC.ClienteId 
        JOIN Usuarios U ON UC.UsuarioId = U.id 
        JOIN Productos pro ON p.IdProducto = pro.Id 
        JOIN PlanesPago PP ON p.IdPlan = PP.Id 
        JOIN FechasPagos FP ON PP.Id = FP.PlanId 
        JOIN PeriodosCobro PC ON p.IdPeriodoCobro = PC.Id 
    WHERE p.IdCliente = @ID_CLIENTE
        AND P.Estado = 1 
        AND P.IdEstadoInterno = 2
        AND FP.Estado = 0
),

Saldos AS (
	SELECT idP, saldoPtmo
	FROM SALDOCALCULADO
	WHERE row_num = 1
),

SaldoTotPtmo AS (
    SELECT 
        CASE
            WHEN ISNULL((SELECT SUM(Monto) FROM PAGOS WHERE IdFechaPago = FP.Id AND Estado = 1), 0) > 
                CAST(((Pre.Monto * (Pre.TasaInteres / 100)) / PP.CuotasPagar) AS DECIMAL(18, 2))
            THEN 
                CAST(FP.Monto - (Pre.Monto * (Pre.TasaInteres / 100) / PP.CuotasPagar) AS DECIMAL(18, 2)) -
                ((SELECT SUM(Monto) FROM PAGOS WHERE IdFechaPago = FP.Id AND Estado = 1) - 
                CAST(((Pre.Monto * (Pre.TasaInteres / 100)) / PP.CuotasPagar) AS DECIMAL(18, 2)))
            ELSE 
                CAST(FP.Monto - (Pre.Monto * (Pre.TasaInteres / 100) / PP.CuotasPagar) AS DECIMAL(18, 2))
        END AS capital,

        CASE 
            WHEN CAST((Pre.Monto * (Pre.TasaInteres / 100) / PP.CuotasPagar) AS DECIMAL(18, 2)) > 
                (SELECT SUM(Monto) FROM Pagos WHERE IdFechaPago = FP.Id)
            THEN 
                CAST((Pre.Monto * (Pre.TasaInteres / 100) / PP.CuotasPagar) AS DECIMAL(18, 2)) - 
                (SELECT SUM(Monto) FROM Pagos WHERE IdFechaPago = FP.Id)
            WHEN CAST((Pre.Monto * (Pre.TasaInteres / 100) / PP.CuotasPagar) AS DECIMAL(18, 2)) <= 
                (SELECT SUM(Monto) FROM Pagos WHERE IdFechaPago = FP.Id)
            THEN 0
            ELSE 
                CAST((Pre.Monto * (Pre.TasaInteres / 100) / PP.CuotasPagar) AS DECIMAL(18, 2)) 
        END AS intCorriente,
		(fp.Monto * 0.001) * 
		CASE 
			WHEN DATEDIFF(DAY, fp.FechaPago, @FechaActual) > 0 
			THEN DATEDIFF(DAY, fp.FechaPago, @FechaActual) 
			ELSE 0 
		END AS intMora
    FROM 
        Prestamos Pre
        JOIN Personas per ON pre.IdCliente = per.Id 
        JOIN UsuarioCliente UC ON Pre.IdCliente = UC.ClienteId 
        JOIN Usuarios U ON UC.UsuarioId = U.id 
        JOIN Productos pro ON pre.IdProducto = pro.Id 
        JOIN PlanesPago PP ON pre.IdPlan = PP.Id 
        JOIN FechasPagos FP ON PP.Id = FP.PlanId 
        JOIN PeriodosCobro PC ON pre.IdPeriodoCobro = PC.Id
    WHERE 
        pre.IdCliente = @ID_CLIENTE
        AND Pre.Estado = 1 
        AND Pre.IdEstadoInterno = 2
        AND FP.Estado = 0
)

SELECT DISTINCT TOP 1
    P.Id AS nroPrestamo, 
    CONCAT(per.Id, ' ' + PER.Nombres + ' ' + PER.Apellidos) AS codClientes, 
    p.Estado AS estadoPtmo,
    p.TotalMonto AS mtoPrestamo, 
    p.TasaInteres AS tasaInteres, 

    -- Saldo CAPITAL pendiente de préstamo
	(SELECT 
	  CASE 
		-- Si todos los idP son iguales, selecciona el saldo del primer registro
		WHEN COUNT(DISTINCT idP) = 1 THEN MIN(saldoPtmo)
		-- Si los idP son distintos, suma los saldos
		WHEN COUNT(DISTINCT idP) > 1 THEN SUM(saldoPtmo)
	  END AS saldoResultado
	FROM Saldos)  AS saldoPtmo,

	(SELECT SUM(capital + intCorriente + intMora) AS saldoTotPtmo FROM  SaldoTotPtmo) AS SaldoTotPtmo,
	   	 
    -- Conteo de cuotas restantes
    (SELECT COUNT(*) FROM FechasPagos WHERE PlanId = PP.Id AND Estado = 0) AS Conteo,

    U.id AS asesor, 
    u.Nombre + ' ' + u.Apellido AS nombreAsesor, 
    '3%' AS tMora, 
    p.FechaAprobacion AS fDesembolso, 
    pro.Descripcion AS producto, 
    FP.Monto AS cuota, 
    PP.CuotasPagar AS plazo,

    -- Período del préstamo
    (CASE
        WHEN pc.Id = 1 THEN 'Semanal'
        WHEN pc.Id = 2 THEN 'Quincenal'
        WHEN pc.Id = 3 THEN 'Mensual'
        ELSE 'Periodo desconocido'
    END) AS Periodo,

    per.Direccion AS direccion, 
    per.Cel AS telefono,

    -- Mora acumulada para el cliente
    (SELECT ISNULL(SUM(M.Mora), 0) FROM Moras M WHERE M.IdPrestamo = @ID_CLIENTE) AS mora,

    -- Saldo total pendiente, incluyendo mora
    (p.Monto - (SELECT ISNULL(SUM(PAG.Monto), 0) 
                FROM Pagos PAG 
                JOIN FechasPagos FP ON PAG.IdFechaPago = FP.Id 
                JOIN PlanesPago PP ON FP.PlanId = PP.Id 
                WHERE PP.Id = P.Id)) 
    + (SELECT ISNULL(SUM(M.Mora), 0) FROM Moras M WHERE M.IdPrestamo = P.Id) AS totalSTotales
	FROM Prestamos P 
	JOIN Personas per ON p.IdCliente = per.Id 
	JOIN UsuarioCliente UC ON P.IdCliente = UC.ClienteId 
	JOIN Usuarios U ON UC.UsuarioId = U.id 
	JOIN Productos pro ON p.IdProducto = pro.Id 
	JOIN PlanesPago PP ON p.IdPlan = PP.Id 
	JOIN FechasPagos FP ON PP.Id = FP.PlanId 
	JOIN PeriodosCobro PC ON p.IdPeriodoCobro = PC.Id 

	WHERE p.IdCliente = @ID_CLIENTE 
	AND P.Estado = 1 
	AND P.IdEstadoInterno = 2

	ORDER BY saldoPtmo

END
