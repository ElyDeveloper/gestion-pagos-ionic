import {/* inject, */ BindingScope, injectable} from '@loopback/core/dist';
import {keys} from '../env/interfaces/Servicekeys.interface';

var nodemailer = require('nodemailer');

@injectable({scope: BindingScope.TRANSIENT})
export class NotifyService {
  constructor() {}

  async EmailNotification(
    email: string,
    subject: string,
    content: string,
    attachment?: any,
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      host: keys.SMTP_CLIENT,
      port: 587,
      secure: false,
      auth: {
        user: keys.SENDER_EMAIL,
        pass: keys.SMTP_PSWD,
      },
    });

    const mailOptions = {
      from: keys.SENDER_EMAIL,
      to: email,
      subject: subject,
      text: content,
      attachments: attachment ? [attachment] : undefined,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      //console.log('Email enviado:', info.response);
      return true;
    } catch (error) {
      console.error('Error al enviar el email:', error);
      return false;
    }
  }
}
