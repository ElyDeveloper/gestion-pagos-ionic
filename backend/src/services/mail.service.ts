// src/services/mail.service.ts
import nodemailer from 'nodemailer';
import {keys} from '../env/interfaces/Servicekeys.interface';
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: keys.SMTP_CLIENT,
      port: 587,
      secure: false,
      auth: {
        user: keys.SENDER_EMAIL,
        pass: keys.SMTP_PSWD,
      },
    });
  }

  async sendWelcomeEmail(to: string, password: string) {
    //TODO Impedir envio de correo de bienvenida
    // const mailOptions = {
    //   from: keys.SENDER_EMAIL,
    //   to: to,
    //   subject: 'Bienvenido a nuestra aplicación',
    //   text: `Tu contraseña temporal es: ${password}`,
    // };

    // try {
    //   await this.transporter.sendMail(mailOptions);
    //   //console.log('Correo enviado exitosamente');
    // } catch (error) {
    //   console.error('Error al enviar correo:', error);
    // }
  }

  async sendChangePassword(to: string, password: string) {
    const mailOptions = {
      from: keys.SENDER_EMAIL,
      to: to,
      subject: 'Cambio de Contraseña',
      text: `Se ha cambiado tu Contraseña en el sistema de Reportes, Tu nueva contraseña es: ${password}, Si no has sido tu, favor cambia tu contraseña inmediatamente o ponte en contacto con un adminstrador del Sistema`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      //console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar correo:', error);
    }
  }
}
