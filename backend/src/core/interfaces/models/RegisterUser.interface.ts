
export interface RegisterUserInterface {
  rolId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface credentialShema {
  correo: string,
  username: string,
  newPassword: string,
}

export interface resetPassword {
  user: number,
  newPassword: string
}
