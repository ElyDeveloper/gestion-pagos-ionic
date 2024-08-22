export namespace viewOf {
  export const GET_CREDENTIAL = `SELECT cr.Correo, cr.Username, cr.Hash
  FROM dbo.credenciales AS cr
  INNER JOIN usuario AS us ON cr.Correo = us.Correo`;

  export const getViewPrestamos = `SELECT * from VistaPrestamosClientesTipoPrestamos`;
  export const getTipoPrestamos = `SELECT * from TipoPrestamos`;
  export const getViewTipoPrestamos = `SELECT * from VistaTipoPrestamos`;

  export const getViewPagos = `SELECT * from VistaPagosConDetalle`;

  export const getViewCuotasActivas = `SELECT * from VistaCuotasActivas`;

  export const getCuotas = `SELECT * from Cuotas`;
}
