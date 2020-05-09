const mongoose = require('../database');

const CategoriaSchema = new mongoose.Schema({
nome: {
    type: String,
    required: true,
},
descricao: {
    type: String,
    required: true,
},
createdAt: {
    type: Date,
    default: Date.now,
},
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria;