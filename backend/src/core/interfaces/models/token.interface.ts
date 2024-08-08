export interface token {
  exp: number,
  data: {
    UserID: number,
    UserNAME: string,
    Role: number
  }
}
