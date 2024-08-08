import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
import {keys} from '../env/interfaces/Servicekeys.interface';

var nodemailer = require('nodemailer');

@injectable({scope: BindingScope.TRANSIENT})
export class NotifyService {
  constructor() { }

  async EmailNotification(email: string, subject: string, content: string, atachment?: any) {
    let isSend: boolean = false;
    var mailOptions: any;
    var transporter = nodemailer.createTransport({
      host: keys.SMTP_CLIENT,
      port: 587,
      secure: false,
      auth: {
        user: keys.SENDER_EMAIL,
        pass: keys.SMTP_PSWD,
      },
    });
    if (atachment) {
      mailOptions = {
        from: keys.SENDER_EMAIL,
        to: `${email}`,
        subject: `${subject}`,
        text: `${content}`,
      };
    } else {
      mailOptions = {
        from: keys.SENDER_EMAIL,
        to: `${email}`,
        subject: `${subject}`,
        text: `${content}`,
      };
    }

    await transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
        isSend = false;
      } else {
        console.log('Email enviado: ' + info.response);
        isSend = true;
      }
    });

    return isSend;


  }

}
