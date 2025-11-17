require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database/db');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const servicesRoutes = require('./routes/services');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/services', servicesRoutes);

app.get('/', (req, res) => res.send('API da Construtora LCI está no ar!'));

app.listen(PORT, () => {
  console.info(`Servidor rodando na porta ${PORT} (env=${process.env.NODE_ENV || 'development'})`);
});
