const { celebrate, Segments, Joi } = require('celebrate');

const Usuario = require('../models/Usuario');

module.exports = {
    verificaCad: celebrate({
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().min(3).max(30).required(),
            sobrenome: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            sexo: Joi.string().length(1).required(),
            password: Joi.string().required()
        })
    }),
    async index (request, response) {
        try {
            const usuario = await Usuario.find();
    
            return response.send({ usuario });
        } catch (err) {
            return response.status(400).send({ error: 'Erro ao carregar lista de usuários' });
        }
    },
    async create(request, response) {
        try {
            const { nome, sobrenome, email, sexo, password } = request.body;
    
            const usuario = await Usuario.create({ 
                nome,
                sobrenome,
                email,
                sexo,
                password
            });
            
            await usuario.save();

            usuario.password = undefined;
            
            return response.send({ usuario });
        } catch (err) {
            if (err.code === 11000){
                const campo = Object.keys(err.keyPattern)[0];
                return response.status(400).send({ error: 'O ' + campo + ' já foi informado.' });
            }
            return response.status(400).send({ error: 'Erro ao cadastrar usuário.' });
        }
    }
}