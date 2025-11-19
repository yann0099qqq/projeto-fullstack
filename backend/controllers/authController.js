const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../database/knex');


exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = await db('users')
      .insert({ name, email, phone, password_hash: hashed })
      .returning(['id','name','email']);

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: user[0], token });

  } catch (err) {
    res.status(400).json({ error: 'Erro ao registrar', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });

  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
};
