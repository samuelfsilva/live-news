const express = require('express');

const EventoController = require('./controllers/EventoController');
const UsuarioController = require('./controllers/UsuarioController');
const CategoriaController = require('./controllers/CategoriaController');

const routes = express.Router();

routes.get('/', function(request, response) {
    return response.send('API está funcionando.');
});
/*
    DADOS PESSOAIS
*/
routes.get('/usuario', UsuarioController.index);

routes.post('/usuario', UsuarioController.verificaCad, UsuarioController.create);
/*
    EVENTO
*/
routes.get('/evento', EventoController.index);

routes.get('/evento/:eventoId', EventoController.verificaFind, EventoController.find);

routes.post('/evento', EventoController.verificaCad, EventoController.create);

routes.post('/eventoFoto/:eventoId', EventoController.imageMulter, EventoController.insertImagem);

routes.put('/evento/:eventoId', EventoController.verificaUpdate, EventoController.update);

routes.delete('/evento/:eventoId', EventoController.verificaDel, EventoController.delete);
/*
    CATEGORIA
*/
routes.get('/categoria', CategoriaController.index);

routes.post('/categoria', CategoriaController.verificaCad, CategoriaController.create);

routes.delete('/categoria/:categoriaId', CategoriaController.verificaDelete, CategoriaController.delete);



module.exports = routes;