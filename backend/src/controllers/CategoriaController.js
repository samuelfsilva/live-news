const { celebrate, Segments, Joi } = require('celebrate');

const Categoria = require('../models/Categoria');

module.exports = {
    verificaCad: celebrate({
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().min(3).max(30).required(),
            descricao: Joi.string().required()
        })
    }),
    async index (request, response) {
        try {
            const categoria = await Categoria.find();
    
            return response.send({ categoria });
        } catch (err) {
            return response.status(400).send({ error: 'Erro ao carregar lista de categorias' });
        }
    },
    async create(request, response) {
        try {
            const { nome, descricao } = request.body;
    
            const categoria = await Categoria.create({ 
                nome,
                descricao
            });
            
            await categoria.save();
            
            return response.send({ categoria });
        } catch (err) {
            return response.status(400).send({ error: 'Erro ao cadastrar endereço.' });
        }
    }
}