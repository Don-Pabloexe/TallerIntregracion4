const nodemailer = require('nodemailer');

// Configuración del transportador de Nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'feliarellanovargas@gmail.com', // Cambia por tu correo de Gmail
    pass: 'PipeeAV3' // Cambia por tu contraseña de Gmail
  }
});

// Función para enviar correos electrónicos
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
        reject(error);
      } else {
        console.log('Correo enviado: ' + info.response);
        resolve(info);
      }
    });
  });
};

module.exports = { sendEmail };
