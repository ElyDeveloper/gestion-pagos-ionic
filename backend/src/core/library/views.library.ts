export namespace viewOf {
  export const GET_CREDENTIAL = `SELECT cr.Correo, cr.Username, cr.Hash
  FROM dbo.credenciales AS cr
  INNER JOIN usuario AS us ON cr.Correo = us.Correo`;

  export const getClientes = `SELECT * from Clientes`;
  export const getViewClientes = `SELECT * from vistaClientes`;
  export const getPrestamos = `SELECT
    Prestamos.*,
    Clientes.Nombres,
    Clientes.Apellidos,
    TipoPrestamos.Nombre
FROM
    Prestamos
INNER JOIN
    Clientes ON Prestamos.IdCliente = Clientes.Id
INNER JOIN
    TipoPrestamos ON Prestamos.IdTipoPrestamo = TipoPrestamos.Id`;

  export const getViewPrestamos = `SELECT * from VistaPrestamosClientesTipoPrestamos`;
  export const getTipoPrestamos = `SELECT * from TipoPrestamos`;
  export const getViewTipoPrestamos = `SELECT * from VistaTipoPrestamos`;

  export const getPagos = `SELECT
    p.[Id] AS PagoId,
    p.[IdPrestamo],
    p.[FechaPago],
    p.[Monto],
    p.[Estado] AS EstadoPago,
    tp.[Nombre] AS TipoPrestamoNombre,
    c.[Nombres] AS ClienteNombre,
    c.[Apellidos] AS ClienteApellidos
FROM
    [Cobros].[dbo].[Pagos] p
INNER JOIN
    [Cobros].[dbo].[Prestamos] pr ON p.[IdPrestamo] = pr.[Id]
INNER JOIN
    [Cobros].[dbo].[Clientes] c ON pr.[IdCliente] = c.[Id]
INNER JOIN
    [Cobros].[dbo].[TipoPrestamos] tp ON pr.[IdTipoPrestamo] = tp.[Id]`;

  export const getViewPagos = `SELECT * from VistaPagosConDetalle`;

  export const getViewCuotasActivas = `SELECT * from VistaCuotasActivas`;

  export const getCuotas = `SELECT * from Cuotas`;
}
