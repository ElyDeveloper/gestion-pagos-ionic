USE [Cobros]
GO
/****** Object:  StoredProcedure [dbo].[SP_RDetallePagosEfectuados]    Script Date: 14/10/2024 18:34:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[SP_RDetallePagosEfectuados]
	-- Add the parameters for the stored procedure here
	@ID_CLIENTE INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	WITH CapitalCalculado AS (
    SELECT 
        fp.Id, 
        CAST(
            CASE 
                WHEN (SUM(pag.Monto) - (pre.Monto * (pre.TasaInteres / 100) / pp.CuotasPagar) - 
                      ISNULL((SELECT M.Mora FROM Moras M WHERE M.IdFechaPago = fp.Id), 0)) < 0
                THEN 0
                ELSE (SUM(pag.Monto) - (pre.Monto * (pre.TasaInteres / 100) / pp.CuotasPagar) - 
                      ISNULL((SELECT M.Mora FROM Moras M WHERE M.IdFechaPago = fp.Id), 0))
            END AS DECIMAL(18, 2)
        ) AS capital
    FROM Pagos pag
    JOIN FechasPagos fp ON pag.IdFechaPago = fp.Id
    JOIN PlanesPago pp ON fp.PlanId = pp.Id
    JOIN Prestamos pre ON pp.Id = pre.IdPlan
    WHERE pre.IdCliente = @ID_CLIENTE 
      AND pre.Estado = 1
      AND pre.IdEstadoInterno = 2
    GROUP BY fp.Id, pre.Monto, pre.TasaInteres, pp.CuotasPagar
)

SELECT 
    fp.Id AS IDFP, 
    fp.Estado AS Estado, 
    MAX(pag.FechaPago) AS FechaPago,  
    SUM(fp.Monto) AS MontoTotal,  
    SUM(pag.Monto) AS total, 

    CAST(
        CASE 
            WHEN (SUM(pag.Monto) - (pre.Monto * (pre.TasaInteres / 100) / pp.CuotasPagar) - 
                ISNULL((SELECT M.Mora FROM Moras M WHERE M.IdFechaPago = fp.Id), 0)) < 0 
            THEN 0 
            ELSE (SUM(pag.Monto) - (pre.Monto * (pre.TasaInteres / 100) / pp.CuotasPagar) - 
                ISNULL((SELECT M.Mora FROM Moras M WHERE M.IdFechaPago = fp.Id), 0))
        END AS DECIMAL(18, 2)
    ) AS capital,

    CASE 
        WHEN CAST((pre.Monto * (pre.TasaInteres / 100) / pp.CuotasPagar) AS DECIMAL(18, 2)) > SUM(pag.Monto)
            THEN SUM(pag.Monto)
        ELSE CAST((pre.Monto * (pre.TasaInteres / 100) / pp.CuotasPagar) AS DECIMAL(18, 2)) 
    END AS intCorrientes,  

    ISNULL((SELECT M.Mora FROM Moras M WHERE M.IdFechaPago = fp.Id), 0) AS mora,  
    pre.Monto AS montoTotal, 
    CAST(
        (pre.Monto - SUM(c.capital) OVER (ORDER BY fp.FechaPago ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) 
        AS DECIMAL(18, 2)
    ) AS sdoCapital

	FROM Pagos pag  
	JOIN FechasPagos fp ON pag.IdFechaPago = fp.Id  
	JOIN PlanesPago pp ON pp.Id = fp.PlanId  
	JOIN Prestamos pre ON pre.IdPlan = pp.Id  
	JOIN Personas per ON per.Id = pre.IdCliente  
	JOIN UsuarioCliente uc ON per.Id = uc.ClienteId  
	JOIN CapitalCalculado c ON c.Id = fp.Id
	WHERE pre.IdCliente = @ID_CLIENTE 
	  AND pre.Estado = 1 
	  AND pre.IdEstadoInterno = 2
	GROUP BY fp.Id, fp.Estado, pre.Monto, pre.TasaInteres, pp.CuotasPagar, fp.FechaPago, c.capital
	ORDER BY MAX(pag.FechaPago);


END
