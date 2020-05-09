const { celebrate, Segments, Joi } = require('celebrate');

const Categoria = require('../models/Categoria');

module.exports = {
    verificaCad: celebrate({
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().min(3).max(30).required(),
            descricao: Joi.string().required()
        })
    }),
    verificaDelete: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            eventoId: Joi.string().required().length(24).regex(/^[0-9a-fA-F]+$/),
        })
    }),
    async index (request, response) {
        try {
            const categorias = await Categoria.find();
    
            return response.send({ categorias });
        } catch (err) {
            return response.status(400).send({ error: 'Erro ao carregar lista de categorias' });
        }
    },
    async find (request, response) {
        try {
            const categoriaId = request.params.categoriaId;
            const categoria = await Categoria.find({ _id: categoriaId });
    
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
    },
    async delete(request, response) {
        try {
            const categoriaId = request.params.categoriaId;
            const categoriaSearch = await Categoria.find({ _id: categoriaId });

            if (categoriaSearch) {
                const evento = await Categoria.findByIdAndDelete(categoriaId);

                await evento.save();
        
                return response.status(200);
            } else {
                return response.status(400).send({ error: 'Nenhuma categoria foi encontrada' });
            }
        } catch (err) {
            return response.status(400).send({ error: 'Erro ao excluir categoria' });
        }
    },
}