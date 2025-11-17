const express = require('express');
const cors = require('cors');
const routes = require('./routes'); 

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.use('/', routes);

module.exports = app;
