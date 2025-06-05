import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EnviarEmailsService {

  constructor() { }
  enviarCorreoSolicitudValidacion(email: any, mensaje: string, titulo: string) {
    for (let i = 0; i < email.length; i++) {
      const templateParams = {
        name: "aplazaj@gmail.com",
        message: mensaje,
        to_name: email[i].email,
        title: titulo,
      };

      emailjs.send(
        'service_4wmm18d',
        'template_v64dwc2',
        templateParams,
        'Q176HFF_-4P1MPuGJ'
      )
        .then(() => {
          console.log('✅ Correo enviado con éxito');
        })
        .catch((error) => {
          console.error('❌ Error al enviar el correo:', error);
        });
    }

  }


}
