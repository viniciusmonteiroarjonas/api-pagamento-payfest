module.exports = (app) => {

    app.get('/pagamentos', (rer, res) => {
        res.send('');
    });

    app.post('/pagamentos/pagamento', function (req, res) {

        req.assert("forma_de_pagamento", "Forma de Pagamento é obrigatório").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal").notEmpty().isFloat();

        var erros = req.validationErrors();

        if(erros){
            console.log('Erros de validação encontrados');
            res.status(400).send(erros);

            return;
        }

        const pagamento = req.body;

        console.log('Processanto um requisição de um novo pagamento');

        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, function (erro, resultado) {

            if (erro) {
                console.log('Erro ao inserir no banco:' +  erro);
                res.status(400).send(erro);
            } else {
                pagamento.id = resultado.insertId;
                console.log('pagamento criado');
                res.location('/pagamentos/pagamento/' + pagamento.id);

                const response = {
                    dados_do_pagamento: pagamento,
                    links:[
                        {
                            href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                            rel:"confirmar",
                            method:"PUT"
                        },
                        {
                            href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                            rel:"cancelar",
                            method:"DELETE"
                        }
                    ]

                }

                res.status(201).json(response);
            }

        });

    });

    app.put('/pagamentos/pagamento/:id', function(req, res){

        let pagamento = {};
        const id = req.params.id;

        pagamento.id = id;
        pagamento.status = "CONFIRMADO";

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro){

            if(erro){
                res.status(500).send(erro);
                return;
            }

            console.log('Pagamento Confirmado');
            res.send(pagamento);

        });

    });

    app.delete('/pagamentos/pagamento/:id', function(req, res){
        let pagamento = {};
        const id = req.params.id;

        pagamento.id = id;
        pagamento.status = "CANCELADO";

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);
        
        pagamentoDao.atualiza(pagamento, function(erro){

            if(erro){
                res.status(500).send(erro);
                return;
            }

            console.log('Pagamento cancelado');
            res.status(203).send(pagamento);

        });

    });

}


