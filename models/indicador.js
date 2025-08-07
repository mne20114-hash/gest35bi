// models/Indicador.js
const mongoose = require('mongoose');

const indicadorSchema = new mongoose.Schema({
  nome: String,
  meta: String,
  oeo: String,
  desempenhos: {
    janeiro: String,
    fevereiro: String,
    marco: String,
    abril: String,
    maio: String,
    junho: String,
    julho: String,
    agosto: String,
    setembro: String,
    outubro: String,
    novembro: String,
    dezembro: String
  }
});

module.exports = mongoose.model('Indicador', indicadorSchema);
