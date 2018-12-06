var fs = require('fs');

fs.readFile('imagem.png', function(erro, buffer){
    console.log('Arquivo lido');

    fs.writeFile('imagem2.png', buffer, function(erro){
        console.log('Arquivo escrito');
    });
});