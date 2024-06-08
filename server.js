const express = require('express');

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const HOSTNAME = '127.0.0.1';
const PORT = 3000;
const DEFAULT_LOCATION = path.join(__dirname, 'index.html');
const NOT_FOUND_LOCATION = path.join(__dirname, 'pages/not-found.html');
const SERVER_RUNNING_MESSAGE = `O servidor está sendo executado em http://${HOSTNAME}:${PORT}/`;
const REGEX_PAGINAS = /^\/pages\/(site|imagens|produtos|formulario|download)\.html$/;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(DEFAULT_LOCATION);
});

app.get('/index.html', (req, res) => {
    res.sendFile(DEFAULT_LOCATION);
});

app.get('/pages/usuario.html/:id/:nome', (req, res) => {
    const id = req.params.id;
    const nome = req.params.nome;
    
    const sitePath = path.join(__dirname, 'pages', 'usuario.html');
    
    fs.readFile(sitePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo usuario.html:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        
        const pageContent = data.replace('{{id}}', id).replace('{{nome}}', nome);
        
        res.send(pageContent);
    });
});

app.post('/submit-form', (req, res) => {
    const formData = req.body;

    console.log(req.body);

    const responsePage = `
        <!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <title>Atividade 03</title>
                <link rel="stylesheet" type="text/css" href="/css/web.css">
            </head>
            <body>
                <div id="div_principal">
                    <header id="cabecalho">
                        <nav id="navegador">
                            <ul>
                                <li><a href="/pages/site.html" target="_self">Início</a></li>
                                <li><a href="/pages/formulario.html" target="_self">Cadastro de Clientes</a></li>
                                <li><a href="/pages/produtos.html" target="_self">Lista de Produtos</a></li>
                                <li><a href="/pages/download.html" target="_self">Download</a></li>
                                <li><a href="/pages/imagens.html" target="_self">Imagens</a></li>
                            </ul>
                        </nav>
                    </header>

                    <div id="div_conteudo">
                        <h1>Resposta do Formulário</h1>
                        <p>Nome: ${formData.nome}</p>
                        <p>Endereço: ${formData.endereco}</p>
                        <p>Telefone: ${formData.telefone}</p>
                        <p>UF: ${formData.uf}</p>
                        <p>Cidade: ${formData.cidade}</p>
                        <p>Sexo: ${formData.sexo}</p>
                        <p>CPF: ${formData.cpf}</p>
                        <p>RG: ${formData.rg}</p>
                        <p>Estado Civil: ${formData.estado_civil}</p>
                    </div>
                    <footer id="rodape">
                        <p>Autor: André Archanjo Nunes Coelho</p>
                        <p>Contato: <a href="mailto:archanjoandre@yahoo.com.br">archanjoandre@yahoo.com.br</a></p>
                    </footer>
                </div>
            </body>
        </html>
    `;

    res.send(responsePage);
});

app.get(REGEX_PAGINAS, (req, res) => {
    const page = req.params[0];
    const pagePath = path.join(__dirname, 'pages', `${page}.html`);
    console.log(pagePath);
    res.sendFile(pagePath);
});

app.get('/json/data', (req, res) => {
    const jsonData = {
        message: 'JSON de exemplo',
        status: 200,
        data: [
            {
                id: 1,
                name: 'André Coelho',
            },
            {
                id: 2,
                name: 'Maurício Coelho',
            },
        ]
    };
    res.status(200).json(jsonData);
});

app.get('*', (req, res) => {
    res.status(404).sendFile(NOT_FOUND_LOCATION);
});

app.listen(PORT, HOSTNAME, () => {
    console.log(SERVER_RUNNING_MESSAGE);
});