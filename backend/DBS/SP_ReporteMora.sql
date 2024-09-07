USE [Cobros]
GO

/****** Object:  StoredProcedure [dbo].[SP_ReporteMora]    Script Date: 07/09/2024 13:10:39 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<RICARDO RIVAS>
-- Create date: <05/09/2024>
-- Description:	<Consulta para obtener el registro de las Moras actuales>
-- =============================================
CREATE PROCEDURE [dbo].[SP_ReporteMora]
AS
BEGIN
	DECLARE @FechaActual DATE = GETDATE();

SELECT 
    per.Id AS codCliente, 
    per.Nombres + ' ' + per.Apellidos AS Nombre, 
    p.Id AS codPrestamo, 
    p.Monto,
    (p.Monto - (
        SELECT ISNULL(SUM(P.Monto), 0)
        FROM Pagos P
        JOIN FechasPagos FPAG ON P.IdFechaPago = FPAG.Id
        WHERE FPAG.PlanId = fp.PlanId
    )) AS saldPtmo,
    DATEDIFF(DAY, fp.FechaPago, @FechaActual) AS DiasMora,
    ((p.Monto * 0.01) * DATEDIFF(DAY, fp.FechaPago, @FechaActual)) AS montoMora
FROM 
    FechasPagos fp
    JOIN PlanesPago pp ON fp.PlanId = pp.Id
    JOIN Prestamos p ON pp.Id = p.IdPlan
    JOIN Personas per ON p.IdCliente = per.Id 
WHERE 
    fp.FechaPago < @FechaActual 
    AND fp.Estado = 0;

END
GO


