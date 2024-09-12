USE [Cobros]
GO

/****** Object:  StoredProcedure [dbo].[SP_ReporteCarteraAsesor]    Script Date: 12/09/2024 10:56:33 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Ricardo Rivas>
-- Create date: <11/09/2024>
-- Description:	<Reporte de cartera-asesor>
-- =============================================
CREATE PROCEDURE [dbo].[SP_ReporteCarteraAsesor]
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

	SELECT DISTINCT P.Id as IdPersona, p.Nombres +' '+ p.Apellidos AS nombreCliente, P.Cel AS celular,
	DATENAME(WEEKDAY, (SELECT TOP 1 FechaPago FROM FechasPagos WHERE Estado = 0 AND PlanId = PP.Id)) AS diaPago,
	pre.Monto AS montoOtorgado,
	ROUND(CAST(pre.monto - (fp.Monto - ((pre.Monto * (pre.TasaInteres / 100)) / pp.CuotasPagar))AS DECIMAL(18, 2)), 2) AS saldoCapitalActual,
	(CAST((pre.monto + (pre.Monto * (pre.TasaInteres / 100))) - fp.Monto AS DECIMAL(18, 2)))  AS saldoActual,
	fp.Monto AS valorCuota, pp.CuotasPagar AS plazo,
	(SELECT CASE WHEN DATEDIFF(MONTH, FechaInicio, FechaFin) < 0 THEN 0 ELSE DATEDIFF(MONTH, FechaInicio, FechaFin) END FROM PlanesPago WHERE Id = pp.Id) AS meses,
	pre.TasaInteres AS tasa,
	(SELECT COUNT(*) FROM Pagos pag2 JOIN FechasPagos fp2 ON pag2.IdFechaPago = fp2.Id  WHERE fp.PlanId = fp2.PlanId) AS cuotasPagadas,
	pre.TotalMonto AS valorTotal,
	ISNULL((SELECT SUM(Monto) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL), 0) AS valorCuotasAtrasadas, --preguntar esto
	ISNULL((SELECT SUM(DATEDIFF(DAY, FechaPago, @FECHA_ACTUAL)) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL AND Estado = 0), 0) AS diasEnMora,
	ISNULL((((SELECT SUM(Monto) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL) * 0.1) + (SELECT SUM(Monto) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL)), 0) AS totalMora, --preguntar esto
	(SELECT TOP 1 FechaPago FROM FechasPagos where PlanId = pp.Id ORDER BY FechaPago DESC) AS fechaVencimiento,
	ISNULL((((SELECT SUM(Monto) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL) * 0.1) + (SELECT SUM(Monto) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL)), 0) -
	ISNULL((SELECT SUM(Monto) FROM FechasPagos WHERE PlanId = PP.Id AND FechaPago < @FECHA_ACTUAL), 0) AS mora
	FROM Personas p JOIN UsuarioCliente uc
	ON
	p.Id = uc.ClienteId JOIN Usuarios u 
	ON
	uc.UsuarioId = u.id JOIN Prestamos pre
	ON
	p.Id = pre.IdCliente JOIN PlanesPago pp
	ON
	pre.IdPlan = pp.Id JOIN FechasPagos fp
	ON
	fp.PlanId = pp.Id LEFT JOIN Pagos pag
	ON
	pag.IdFechaPago = fp.Id
	WHERE UsuarioId = @ID_USUARIO AND pre.Estado = 1
END
GO


