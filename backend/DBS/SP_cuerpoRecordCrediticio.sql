USE [Cobros]
GO

/****** Object:  StoredProcedure [dbo].[SP_cuerpoRecordCrediticio]    Script Date: 07/09/2024 13:10:01 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Ricardo Rivas>
-- Create date: <2024-09-07>
-- Description:	<Cuerpo del Reporte de Record Crediticio>
-- =============================================
CREATE PROCEDURE [dbo].[SP_cuerpoRecordCrediticio] 
	-- Add the parameters for the stored procedure here
	@IDCLIENTE int
AS
BEGIN
	--Variable para obtener la fecha actual
	DECLARE  @FECHA_ACTUAL DATE;
	SET @FECHA_ACTUAL = GETDATE();

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT p.Id  AS idPrestamo, FP.FechaPago AS fechaVencimiento, PAG.FechaPago AS fechaCancelacion, 
	CASE 
		WHEN DATEDIFF(DAY, FP.FechaPago, @FECHA_ACTUAL) < 0 THEN 0
		ELSE DATEDIFF(DAY, FP.FechaPago, @FECHA_ACTUAL)
	END AS diasAtraso,
	ROUND(ISNULL(CAST(pag.Monto AS DECIMAL(18, 2)) - 
		(CAST(pag.Monto AS DECIMAL(18, 2)) * 
		(CAST(p.TasaInteres AS DECIMAL(18, 2)) / 100 / pp.CuotasPagar)), 0), 2) AS Capital,

	ROUND(ISNULL(CAST(pag.Monto AS DECIMAL(18, 2)) * 
		(CAST(p.TasaInteres AS DECIMAL(18, 2)) / 100 / pp.CuotasPagar), 0), 2) AS Interes,
	CASE
		WHEN DATEDIFF(DAY, FP.FechaPago, @FECHA_ACTUAL) < 0 THEN 0
		ELSE ((p.Monto * 0.01) * DATEDIFF(DAY, fp.FechaPago, @FECHA_ACTUAL)) 
	END AS Mora,
	-- Cálculo de la cuota a pagar (cuota base + mora)
	ROUND(fp.Monto + 
		CASE 
			WHEN DATEDIFF(DAY, fp.FechaPago, @FECHA_ACTUAL) > 0 THEN 
				(p.Monto * 0.01) * DATEDIFF(DAY, fp.FechaPago, @FECHA_ACTUAL) 
				ELSE 0
		END, 2) AS Cuota


	FROM Prestamos p JOIN PlanesPago pp
	ON
	p.IdPlan = pp.Id JOIN FechasPagos fp
	ON
	pp.Id = fp.PlanId LEFT JOIN Pagos pag
	ON
	fp.Id = pag.IdFechaPago
	WHERE IdCliente = @IDCLIENTE
	ORDER BY p.Id, fp.FechaPago
END
GO


