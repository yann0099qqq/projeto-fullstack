const router = require('express').Router();
const db = require('../database/db');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/services
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name || !description) return res.status(400).json({ message: 'Nome e descrição são obrigatórios.' });
  try {
    const [id] = await db('services').insert({ name, description, icon });
    const newService = await db('services').where({ id }).first();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar serviço.', error: error.message });
  }
});

// GET /api/services (público)
router.get('/', async (req, res) => {
  try {
    const services = await db('services').select('*');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar serviços.', error: error.message });
  }
});

// PUT /api/services/:id
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const count = await db('services').where({ id }).update(req.body);
    if (count === 0) return res.status(404).json({ message: 'Serviço não encontrado.' });
    const updatedService = await db('services').where({ id }).first();
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar serviço.', error: error.message });
  }
});

// DELETE /api/services/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const count = await db('services').where({ id }).del();
    if (count === 0) return res.status(404).json({ message: 'Serviço não encontrado.' });
    res.status(200).json({ message: 'Serviço deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar serviço.', error: error.message });
  }
});

module.exports = router;
