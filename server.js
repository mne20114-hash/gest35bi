const express = require('express');
const mongoose = require('mongoose');
const Indicador = require('./models/indicador');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🧠 View engine EJS configurada
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 📦 Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 🔗 Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/indicadores')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// 🏠 Página inicial
app.get('/', (req, res) => {
  res.render('index'); // views/index.ejs
});

// 🆕 Página de cadastro de indicadores (GET)
app.get('/dashboard/criar', (req, res) => {
  res.render('dashboard/cadastro_indicadore', { error: null });
});

// 📥 Salvar novo indicador (POST)
app.post('/dashboard/criar', async (req, res) => {
  try {
    const { nome, meta, oeo } = req.body;

    const novoIndicador = new Indicador({
      nome,
      meta,
      oeo,
      desempenhos: {}
    });

    await novoIndicador.save();
    res.redirect('/dashboard/acompanhar');
  } catch (error) {
    console.error('Erro ao criar indicador:', error);
    res.render('dashboard/cadastro_indicadore', {
      error: 'Erro ao salvar indicador. Tente novamente.'
    });
  }
});

// 📊 Página de acompanhamento
app.get('/dashboard/acompanhar', async (req, res) => {
  try {
    const indicadores = await Indicador.find();

    const indicadoresPorOeo = {};
    indicadores.forEach(ind => {
      const oeo = ind.oeo || 'Não definido';
      if (!indicadoresPorOeo[oeo]) indicadoresPorOeo[oeo] = [];
      indicadoresPorOeo[oeo].push(ind);
    });

    res.render('dashboard/Gest35BI_acompanhar', { indicadoresPorOeo });
  } catch (error) {
    res.status(500).send('Erro ao carregar indicadores.');
  }
});


// 🔁 API REST -------------------------------

// Buscar todos
app.get('/indicadores', async (req, res) => {
  try {
    const indicadores = await Indicador.find();
    res.json(indicadores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar indicadores' });
  }
});

// Criar
app.post('/indicadores', async (req, res) => {
  try {
    const novo = new Indicador(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar indicador' });
  }
});

// Atualizar nome/meta/oeo
app.put('/indicadores/:id', async (req, res) => {
  try {
    const atualizado = await Indicador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ error: 'Indicador não encontrado' });
    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar indicador' });
  }
});

// Excluir
app.delete('/indicadores/:id', async (req, res) => {
  try {
    const deletado = await Indicador.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ error: 'Indicador não encontrado' });
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir indicador' });
  }
});

// Atualizar desempenho por mês
app.patch('/indicadores/:id/desempenho', async (req, res) => {
  try {
    const { mes, valor } = req.body;
    if (!mes || valor === undefined)
      return res.status(400).json({ error: 'Mês e valor são obrigatórios' });

    const indicador = await Indicador.findById(req.params.id);
    if (!indicador) return res.status(404).json({ error: 'Indicador não encontrado' });

    if (!(mes in indicador.desempenhos))
      return res.status(400).json({ error: 'Mês inválido' });

    indicador.desempenhos[mes] = valor;
    await indicador.save();
    res.json(indicador);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar desempenho' });
  }
});

// ------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
