var restify = require('restify');


var cliente  = restify.createJsonClient({

    url:'http://localhost:3001'
});

cliente.post('/cartoes/autoriza', function(erro, req, res, retorno){
    console.log('Consumindo serviços de cartoes');
    console.log(retorno);
});