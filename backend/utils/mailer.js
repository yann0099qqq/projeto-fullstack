const nodemailer = require("nodemailer");

async function sendMail({ name, email, phone, message }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Formulário do Site" <${process.env.SMTP_FROM}>`,
    to: process.env.CONTACT_RECEIVER,
    subject: `📩 Nova mensagem de ${name}`,
    replyTo: email, // permite responder direto ao cliente
    html: `
      <h2>Novo contato do site</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${phone || "não informado"}</p>
      <p><strong>Mensagem:</strong><br>${message}</p>
    `,
  });
}

module.exports = sendMail;
