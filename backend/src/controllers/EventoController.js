const { celebrate, Segments, Joi } = require('celebrate');
const multer = require("multer");

const multerConfig = require("../config/multer");

const Evento = require('../models/Evento');
const Foto = require('../models/Foto');

module.exports = {
    verificaCad: celebrate({
        [Segments.HEADERS]: Joi.object({
            userid: Joi.string().required().length(24).regex(/^[0-9a-fA-F]+$/),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required(),
            data: Joi.date().required(),
            descricao: Joi.string().required(),
            categoria: Joi.string().required(),
            ativo: Joi.boolean().required()
        })
    }),
    verificaUpdate: celebrate({
        [Segments.HEADERS]: Joi.object({
            userid: Joi.string().required().length(24).regex(/^[0-9a-fA-F]+$/),
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required(),
            data: Joi.date().required(),
            descricao: Joi.string().required(),
            categoria: Joi.string().required()
        })
    }),
    verificaFind: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            eventoId: Joi.string().required().length(24).regex(/^[0-9a-fA-F]+$/),
        })
    }),
    verificaDel: celebrate({
        [Segments.HEADERS]: Joi.object({
            userid: Joi.string().required().length(24).regex(/^[0-9a-fA-F]+$/),
        }).unknown(),
        [Segments.PARAMS]: Joi.object().keys({
            eventoId: Joi.string().required().length(24).regex(/^[0-9a-fA-F]+$/),
        })
    }),
    imageMulter: multer(multerConfig).single("file"),
    async index (request, response) {
        try {
            const eventos = await Evento.find().populate(['usuario','categoria']);
            
            return response.status(200).send({ eventos });
        } catch (err) {
            console.log(err);
            return response.status(400).send({ error: 'Erro ao carregar lista de ventos' });
        }
    },
    async find (request, response) {
        try {
            const eventoId = request.params.eventoId;
            const evento = await Evento.find({ _id: eventoId }).populate(['usuario','categoria']);
            
            return response.status(200).send({ evento });
        } catch (err) {
            console.log(err);
            return response.status(400).send({ error: 'Erro ao carregar lista de itens' });
        }
    },
    async create(request, response) {
        try {
            const userId = request.headers.userid;
            const { nome, data, descricao, categoria } = request.body;
            
            const evento = await Evento.create({ 
                nome, 
                data,
                descricao,
                usuario: userId,
                categoria
            });
            
            await evento.save();
    
            return response.status(200).send({ evento });
        } catch (err) {
            return response.status(400).send({ error: 'Erro ao criar um evento' });
        }
    },
    async update(request, response) {
        try {
            const userId = request.headers.userid;
            const eventoId = request.params.eventoId;

            const { nome, data, descricao, categoria } = request.body;

            const eventoSearch = Evento.find({ _id: eventoId, usuario: userId });

            if (eventoSearch) {
                const evento = await Evento.findByIdAndUpdate(eventoId, { 
                    nome,
                    data, 
                    descricao,
                    categoria
                });

                await evento.save();
        
                return response.status(200).send({ evento });
            } else {
                return response.status(400).send({ error: 'Nenhum evento foi encontrado para este usuário' });
            }
        } catch (err) {
            return response.status(400).send({ error: 'Erro ao atualizar o evento ' });
        }
    },
    async insertImagem(request, response) {
        const { originalname: nome, size: tamanho, key, location: url = "" } = request.file;
        const evento = request.params.eventoId;

        const foto = await Foto.create({
            nome,
            key,
            tamanho,
            url,
            evento
        });

        return response.json(foto);
    },
    async delete(request, response) {
        try {
            const userId = request.headers.userid;
            const eventoId = request.params.eventoId;

            const eventoSearch = Evento.find({ _id: eventoId, usuario: userId });

            if (eventoSearch) {
                const evento = await Evento.findByIdAndDelete(eventoId);

                await evento.save();
        
                return response.status(200);
            } else {
                return response.status(400).send({ error: 'Nenhum evento foi encontrado para este usuário' });
            }
        } catch (err) {
            return response.status(400).send({ error: 'Erro ao exluir o evento' });
        }
    },
}