const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Indicadores simulados (sem MongoDB)
let indicadores = [];

// Página inicial
app.get('/', (req, res) => {
    res.render('index', { title: 'Página Inicial' });
});

// Página para cadastro de indicadores
app.get('/dashboard/criar', (req, res) => {
  res.render('dashboard/cadastro_indicadore', { error: null });
});

// Processar o cadastro do indicador
app.post('/dashboard/criar', (req, res) => {
    const { nome, meta, oeo } = req.body;

    // Validar o OEO para garantir que seja um número entre 1 e 9
    if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(oeo))) {
        return res.render('cadastro-indicador', { error: 'OEO deve ser um número entre 1 e 9' }); // Passando o erro
    }

    // Simula o armazenamento dos indicadores
    indicadores.push({ nome, meta, oeo: Number(oeo) });

    // Redirecionar para a página de dashboard (ou exibir uma mensagem de sucesso)
    res.redirect('/dashboard');
});

// Página de Dashboard/menu da seção
app.get('/dashboard', (req, res) => {
    // Organizar os indicadores por OEO
    const indicadoresPorOeo = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: []
    };

    indicadores.forEach(indicador => {
        if (indicador.oeo >= 1 && indicador.oeo <= 9) {
            indicadoresPorOeo[indicador.oeo].push(indicador);
        }
    });

    res.render('dashboard/Gest35BI_acompanhar', { 
        secao: "Gest35BI", 
        indicadoresPorOeo,
        erro: null
    });
});

// Iniciar o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
