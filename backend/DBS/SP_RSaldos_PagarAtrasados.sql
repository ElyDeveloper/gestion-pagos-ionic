-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Ricardo Rivas>
-- Create date: <01/09/2024>
-- Description:	<SP para obtener los datos de la tabla de saldo pendiente a pagar-atrasados>
-- =============================================
CREATE PROCEDURE SP_RSaldos_PagarAtrasados
	-- Add the parameters for the stored procedure here
	@ID_CLIENTE INT
AS
BEGIN
	DECLARE @FechaActual DATE;
	SET @FechaActual = GETDATE();
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT P.Id AS idPrestamo, FP.FechaPago AS fechaVto,
	CASE 
    WHEN DATEDIFF(DAY, fp.FechaPago, @FechaActual) > 0 
    THEN DATEDIFF(DAY, fp.FechaPago, @FechaActual) 
    ELSE 0 
	END AS dias,
	fp.Monto as cuota, 
	CAST(FP.Monto - (p.Monto * (p.TasaInteres / 100) / PP.CuotasPagar)AS DECIMAL(18, 2)) AS capital,
	CAST((p.Monto * (p.TasaInteres / 100) / PP.CuotasPagar)AS DECIMAL(18, 2))AS intCorriente,
	(fp.Monto * 0.001) * 
	CASE 
		WHEN DATEDIFF(DAY, fp.FechaPago, @FechaActual) > 0 
		THEN DATEDIFF(DAY, fp.FechaPago, @FechaActual) 
		ELSE 0 
	END AS intMora,

	fp.Monto + (fp.Monto * 0.001) * 
	CASE 
		WHEN DATEDIFF(DAY, fp.FechaPago, @FechaActual) > 0 
		THEN DATEDIFF(DAY, fp.FechaPago, @FechaActual) 
		ELSE 0 
	END AS totalSVigentes

	FROM FechasPagos FP JOIN PlanesPago PP
	ON
	FP.PlanId = PP.Id JOIN Prestamos P
	ON 
	PP.Id = P.IdPlan 
	WHERE @ID_CLIENTE = P.IdCliente AND FP.Estado = 0 AND P.Estado = 1 AND P.IdEstadoInterno = 2 AND fp.FechaPago < @FechaActual
	ORDER BY p.Id, FP.FechaPago
END
GO
