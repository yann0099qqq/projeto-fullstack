const express = require('express');
const { body, validationResult } = require('express-validator');
const knex = require('../database/knex');
const nodemailer = require('nodemailer');

const router = express.Router();

/* ================================
   CREATE – POST /contacts
================================ */
router.post('/', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('message').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, phone, message } = req.body;

  try {
    const [contact] = await knex('contacts')
      .insert({ name, email, phone, message })
      .returning(['id','name','email','phone','message','created_at']);

    // Envio de email (opcional)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,
        subject: `Nova mensagem de contato: ${contact.name}`,
        text: `Nome: ${contact.name}\nEmail: ${contact.email}\nTelefone: ${contact.phone}\n\nMensagem:\n${contact.message}`
      });

    } catch (emailErr) {
      console.error('Erro ao enviar email:', emailErr);
    }

    res.status(201).json(contact);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

/* ================================
   READ – GET /contacts
================================ */
router.get('/', async (req, res) => {
  const contacts = await knex('contacts')
    .select('*')
    .orderBy('created_at', 'desc');

  res.json(contacts);
});

/* ================================
   READ – GET /contacts/:id
================================ */
router.get('/:id', async (req, res) => {
  const contact = await knex('contacts')
    .where({ id: req.params.id })
    .first();

  if (!contact) return res.status(404).json({ message: 'Não encontrado' });

  res.json(contact);
});

/* ================================
   UPDATE – PUT /contacts/:id
================================ */
router.put('/:id', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const updated = await knex('contacts')
      .where({ id: req.params.id })
      .update({ name, email, phone, message });

    if (!updated) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    const contact = await knex('contacts')
      .where({ id: req.params.id })
      .first();

    res.json(contact);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar contato' });
  }
});

/* ================================
   DELETE – DELETE /contacts/:id
================================ */
router.delete('/:id', async (req, res) => {
  const deleted = await knex('contacts')
    .where({ id: req.params.id })
    .del();

  if (!deleted) {
    return res.status(404).json({ message: 'Contato não encontrado' });
  }

  res.json({ message: 'Removido' });
});

module.exports = router;
