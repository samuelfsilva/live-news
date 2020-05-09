const mongoose = require('../database');

const ItemSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    ativo: {
        type: Boolean,
        default: true,
    },
    motivoExclusao: {
        type: String,
    },
    data: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;