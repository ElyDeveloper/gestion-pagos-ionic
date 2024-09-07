USE [Cobros]
GO

/****** Object:  StoredProcedure [dbo].[SP_encabezadosRecordCrediticio]    Script Date: 07/09/2024 13:08:53 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Ricardo Rivas>
-- Create date: <2024-09-07>
-- Description:	<Encabezados del Reporte de Record Crediticio>
-- =============================================
CREATE PROCEDURE [dbo].[SP_encabezadosRecordCrediticio]
	-- Add the parameters for the stored procedure here
	@IDCLIENTE int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT DISTINCT pre.Id AS idPrestamo, P.Nombres +' '+ P.Apellidos AS Cliente, P.Direccion, P.Cel AS Telefono, u.Nombre +' '+ u.Apellido AS Asesor,
	pro.Descripcion AS Producto, ea.Descripcion AS Etapa, (SELECT COUNT(*) FROM Prestamos WHERE IdCliente = @IDCLIENTE) AS NOPrest,
	pre.FechaSolicitud as fechaProceso, rc.Descripcion as recordCrediticio,
	(SELECT SUM(Monto) FROM Prestamos WHERE IdCliente = @IDCLIENTE) AS cantidadDesembolso
	FROM Personas P JOIN UsuarioCliente uc
	ON
	p.Id = uc.ClienteId JOIN Usuarios u
	ON
	uc.UsuarioId = u.id JOIN Prestamos pre
	ON
	p.Id = pre.IdCliente JOIN Productos pro
	ON
	pre.IdProducto = pro.Id JOIN EstadosAprobacion ea
	ON
	pre.IdEstadoAprobacion = ea.Id JOIN RecordCrediticio rc
	ON
	p.IdRecordCrediticio = rc.Id
	WHERE P.Id = @IDCLIENTE
END
GO


