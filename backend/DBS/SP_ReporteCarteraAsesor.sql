USE [Cobros]
GO
/****** Object:  StoredProcedure [dbo].[SP_ReporteCarteraAsesor]    Script Date: 02/10/2024 22:45:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Ricardo Rivas>
-- Create date: <11/09/2024>
-- Description:	<Reporte de cartera-asesor>
-- =============================================
ALTER PROCEDURE [dbo].[SP_ReporteCarteraAsesor]
	-- Add the parameters for the stored procedure here
	@ID_USUARIO INT
AS
BEGIN
	DECLARE @FECHA_ACTUAL DATE;
	SET @FECHA_ACTUAL = GETDATE();
	SET LANGUAGE Spanish;
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	WITH CapitalCalculado AS (
    SELECT 
        FP.PlanId,
        FP.Id AS IdFechaPago,
        SUM(CAST((PAG.Monto - (P.Monto * (P.TasaInteres / 100) / PP.CuotasPagar) 
                - ISNULL(MS.MoraTotal, 0)) AS DECIMAL(18, 2))) AS CapitalPago
    FROM FechasPagos FP
    LEFT JOIN Pagos PAG ON PAG.IdFechaPago = FP.Id
    LEFT JOIN (SELECT IdFechaPago, SUM(Mora) AS MoraTotal 
               FROM Moras GROUP BY IdFechaPago) MS ON MS.IdFechaPago = FP.Id
    LEFT JOIN PlanesPago PP ON FP.PlanId = PP.Id
    LEFT JOIN Prestamos P ON PP.Id = P.IdPlan
    WHERE FP.PlanId IN (SELECT Id FROM PlanesPago WHERE IdCliente = p.IdCliente)
    GROUP BY FP.PlanId, FP.Id, P.Monto, P.TasaInteres, PP.CuotasPagar
)

	SELECT DISTINCT 
		P.Id AS IdPersona, 
		pre.Id AS prestamoId, 
		p.Nombres + ' ' + p.Apellidos AS nombreCliente, 
		P.Cel AS celular, 
		DATENAME(WEEKDAY, (SELECT TOP 1 FechaPago FROM FechasPagos WHERE Estado = 0 AND PlanId = PP.Id)) AS diaPago,
		pre.Monto AS montoOtorgado,
		ISNULL((SELECT SUM(C.CapitalPago) FROM CapitalCalculado C WHERE C.PlanId = PP.Id), 0) AS capital,
		PRE.Monto - ISNULL((SELECT SUM(C.CapitalPago) FROM CapitalCalculado C WHERE C.PlanId = PP.Id), 0) AS saldoCapitalActual,
		PRE.TotalMonto - ISNULL((SELECT SUM(pag.Monto) FROM Pagos pag JOIN FechasPagos fp ON pag.IdFechaPago = fp.Id WHERE fp.PlanId = pp.Id), 0) AS saldoActual,
		fp.Monto AS valorCuota,
		CONCAT(PP.CuotasPagar, ' ', 
			CASE
				WHEN pc.Id = 1 THEN 'Semanas'
				WHEN pc.Id = 2 THEN 'Quincenas'
				WHEN pc.Id = 3 THEN 'Meses'
				ELSE 'Periodo desconocido'
			END
		) AS plazo,
		pre.TasaInteres AS tasa,
		(SELECT COUNT(*) FROM Pagos pag2 JOIN FechasPagos fp2 ON pag2.IdFechaPago = fp2.Id WHERE fp.PlanId = fp2.PlanId) AS cuotasPagadas,
		pre.TotalMonto AS valorTotal,
		ISNULL((SELECT SUM(Monto) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL  AND Estado = 0), 0) AS valorCuotasAtrasadas, 
		ISNULL((SELECT SUM(DATEDIFF(DAY, FechaPago, @FECHA_ACTUAL)) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL AND Estado = 0), 0) AS diasEnMora,
		
		ISNULL(CAST((ISNULL((SELECT TOP 1 Monto FROM FechasPagos WHERE PlanId = fp.PlanId AND FechaPago < @FECHA_ACTUAL AND Estado = 0), 0) * 0.001) * 
		ISNULL((SELECT SUM(DATEDIFF(DAY, FechaPago, @FECHA_ACTUAL)) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL AND Estado = 0), 0) AS DECIMAL(18, 2)) + 
		(SELECT SUM(Monto) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL AND Estado = 0), 0) AS totalMora,
		
		
		(SELECT TOP 1 FechaPago FROM FechasPagos WHERE PlanId = pp.Id ORDER BY FechaPago DESC) AS fechaVencimiento,


		CAST((ISNULL((SELECT TOP 1 Monto FROM FechasPagos WHERE PlanId = fp.PlanId AND FechaPago < @FECHA_ACTUAL AND Estado = 0), 0) * 0.001) * 
		ISNULL((SELECT SUM(DATEDIFF(DAY, FechaPago, @FECHA_ACTUAL)) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL AND Estado = 0), 0) AS DECIMAL(18, 2))
		AS mora

	FROM 
		Personas p 
	JOIN UsuarioCliente uc ON p.Id = uc.ClienteId 
	JOIN Usuarios u ON uc.UsuarioId = u.id 
	JOIN Prestamos pre ON p.Id = pre.IdCliente 
	JOIN PlanesPago pp ON pre.IdPlan = pp.Id 
	JOIN FechasPagos fp ON fp.PlanId = pp.Id 
	LEFT JOIN Pagos pag ON pag.IdFechaPago = fp.Id 
	JOIN PeriodosCobro pc ON pre.IdPeriodoCobro = pc.Id
	WHERE 
		u.id = @ID_USUARIO 
		AND pre.Estado = 1 
		AND pre.IdEstadoInterno = 2
	GROUP BY 
		P.Id, pre.Id, p.Nombres, p.Apellidos, P.Cel, pre.Monto, pre.TotalMonto, fp.Monto, PP.CuotasPagar, pc.Id, pre.TasaInteres, pp.Id, fp.PlanId

END