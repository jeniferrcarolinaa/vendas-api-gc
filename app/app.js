const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.json());

// Conexão com o container do MongoDB (usando o hostname 'mongo' da rede do Docker Compose)
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/vendasDB';

mongoose.connect(MONGO_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Definição do Esquema do Produto
const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  descricao: { type: String, required: true },
  estoque: { type: Number, default: 0 }
});

const Produto = mongoose.model('Produto', produtoSchema);

// ------------------- ROTAS DA API -------------------

// GET /itens - Listar todos os produtos
app.get('/itens', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.status(200).json(produtos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos', details: err.message });
  }
});

// GET /item/:id - Listar um produto específico pelo ID
app.get('/item/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar o produto', details: err.message });
  }
});

// POST /item - Adicionar um novo produto
app.post('/item', async (req, res) => {
  try {
    const { nome, preco, descricao, estoque } = req.body;
    const novoProduto = new Produto({ nome, preco, descricao, estoque });
    await novoProduto.save();
    res.status(201).json({ message: 'Produto cadastrado com sucesso!', produto: novoProduto });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar produto', details: err.message });
  }
});

// DELETE /item/:id - Excluir um produto pelo ID
app.delete('/item/:id', async (req, res) => {
  try {
    const produtoDeletado = await Produto.findByIdAndDelete(req.params.id);
    if (!produtoDeletado) {
      return res.status(404).json({ message: 'Produto não encontrado para exclusão' });
    }
    res.status(200).json({ message: 'Produto excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir produto', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});