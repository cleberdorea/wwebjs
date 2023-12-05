const qrcode = require('qrcode-terminal');

const { Client, Location, List, Buttons, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client = new Client({
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: { 
        args: ['--no-sandbox'],
        //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',        
        headless: true,
    },
    authStrategy: new LocalAuth(),

});


client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

//const {contatosAlertaCo2, contatosAlertaAr} = require('./src/contatosEng');

//Saudações p/ iniciar chat e variáveis
let iniciaChat = ['oi','Oi','Olá','Ola','olá','ola','Eai','eai','ei','Ei','opa','Opa','fala','Fala!','fala!','Bom dia!','bom dia!', 'Bom dia', 'bom dia', 'Boa Tarde!', 'Boa tarde', 'boa tarde!', 'boa tarde', 'Boa Noite!', 'boa noite!', 'Boa noite', 'boa noite'];
let confGestaoPt;
let confAltura;

//Iniciando o Chat.
client.on('message', async msg => {
    const chat =  await msg.getChat();
    const contact =  await msg.getContact();
    if(iniciaChat.includes(msg.body)){
         await chat.sendMessage(`Olá, @${contact.id.user}.\nEu sou o Crab!.\nDe acordo com a nova política de segurança da companhia, estarei funcionando apenas no Whatsapp.`, {
            mentions: [contact]
        });
        chat.sendMessage('Digite o número correspondente a área que deseja consultar.\r\n\r\n*1*-Segurança.\r\n\r\n*2*-Meio Ambiente.\r\n\r\n*3*-Processo.\r\n\r\n*4*-Utilidades.\r\n\r\n*5*-Packaging.\r\n\r\n*6*-Oficinas.\r\n\r\n*7*-Manutenção.');
               
    }//Se não estiver na lista de Contatos
    //else if(!contact.isMyContact){
        //chat.sendMessage('Desculpe-me, mas não posso falar com quem eu não conheço.');
    //}//Menu Segurança
    else if(msg.body ==='1'){
        chat.sendMessage('Você selecionou a Segurança.\nAgora digite o número correspondente ao Treinamento que deseja consultar \r\n\r\n*1.1*-Autorizados PT\r\n\r\n*1.2*-Autorizados Altura\r\n\r\n*1.3*-Espaço Confinado.\r\n\r\n*1.4*-ASO.\r\n\r\n*1.5*-Dash de Território Seguro.\r\n\r\n*1.6*-Safety First.\r\n\r\n*00*-Voltar ao menu inicial');
    
    }//Dados Segurança
    else if(msg.body === '1.1'){
        confGestaoPt = false;
        chat.sendMessage('Por favor, digite seu ID.');
           

    }//Consulta Gestão PT
    else if(msg.body.includes('99') && !confGestaoPt){
        //Cria conexão com o banco de dados.
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'seguranca'
        });
        confGestaoPt = true
        let usuario = parseInt(msg.body);    
        connection.query(`SELECT * FROM gestao_pt WHERE id = ${usuario}`, function (error, results, fields) {
            if (error){
                console.error('Erro ao consultar o banco de dados');
                chat.sendMessage('Erro ao consultar o banco de dados');
            }else{
                let dadosId = results;
                let novoDados = dadosId.map(function(objeto){
                    return {
                        "ID ": objeto.id,
                        "Nome ": objeto.nome,
                        "Área ": objeto.area,
                        "Cargo ": objeto.cargo,
                        "Turno ": objeto.turno,
                        "Situação ": objeto.situacao
                    };
                });
                let dadosFuncionario = JSON.stringify(novoDados).replace(/["[\]{}]/g, "").replace(/,/g, "\n");
                if(dadosFuncionario.length === 0){
                    chat.sendMessage('Funcionário não foi encontrado em nossa base de dados. Verifique com o setor de Segurança no trabalho.\nDigite *00* para voltar ao menu inicial')
                }else{
                    chat.sendMessage('Segue abaixo as informações para o ID fornecido.');
                    chat.sendMessage(dadosFuncionario);
                }

            }

        connection.end();
        });
   

    }//Dados Segurança
    else if(msg.body === '1.2'){
        confAltura = false;
        chat.sendMessage('Por favor, digite seu ID.');
           

    }//Consulta Trabalho em Altura
    else if(msg.body.includes('99') && !confAltura){
        //Cria conexão com o banco de dados.
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'seguranca'
        });
        confAltura = true
        let usuario = parseInt(msg.body);    
        connection.query(`SELECT * FROM trabalho_altura WHERE id = ${usuario}`, function (error, results, fields) {
            if (error){
                console.error('Erro ao consultar o banco de dados');
                chat.sendMessage('Erro ao consultar o banco de dados');
            }
            let dadosId = results;
            let novoDados = dadosId.map(function(objeto){
                return {
                    "ID ": objeto.id,
                    "Nome ": objeto.nome,
                    "Área ": objeto.area,
                    "Cargo ": objeto.cargo,
                    "Turno ": objeto.turno,
                    "Situação ": objeto.situacao
                };
            });
            let dadosFuncionario = JSON.stringify(novoDados).replace(/["[\]{}]/g, "").replace(/,/g, "\n");
            if(dadosFuncionario.length === 0){
                chat.sendMessage('Funcionário não foi encontrado em nossa base de dados. Verifique com o setor de Segurança no trabalho.\nDigite *00* para voltar ao menu inicial')
            }else{
                chat.sendMessage('Segue abaixo as informações para o ID fornecido');
                chat.sendMessage(dadosFuncionario);
            }
        connection.end();
        });
   

    }//Segurança. Dash Territótio seguro.
    else if(msg.body === '1.5'){
        const mediaPath = MessageMedia.fromFilePath('./midias/dashterritorio.docx');
        client.sendMessage(mediaPath);
    

    }//Vídeos Safety First
    else if(msg.body === '1.6'){
        chat.sendMessage("Bem vindo ao Safety First🎯.\nAntes de preencher o forms, por favor assista aos vídeos de cada semana. Conto com você!😉👍")
        const semana1 = MessageMedia.fromFilePath('./midias/A_VALVULA.mp4');
        const semana2 = MessageMedia.fromFilePath('./midias/SOU_DONO_BARREIRA_1.mp4');
        const semana3 = MessageMedia.fromFilePath('./midias/SOU_O_DONO_BARREIRA_3.mp4');
        
        chat.sendMessage(semana1, {caption: "Semana 1(A Válvula)📽️"});
        chat.sendMessage(semana2, {caption: "Semana 2(Eu Sou o dono da minha Barreira)📽️"});
        chat.sendMessage(semana3, {caption: "Semana 3(Eu sou o dono da minha Barreira. Parte 3)📽️"});
        chat.sendMessage("Segue abaixo o link do forms:\nhttps://forms.office.com/r/1x1MMCWAq7");
    

    }//Menu Meio Ambiente
    else if(msg.body === '2'){
        chat.sendMessage('Você selecionou o Meio Ambiente.\nAgora digite o número correspondente a sub-area desejada\r\n\r\n*2.1*-ETA\r\n\r\n*2.2*-ETEI\r\n\r\n*00*-Voltar ao menu inicial');
        
    }//Dados ETA
    else if(msg.body === '2.1'){
        //Cria conexão com o banco de dados.
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'utilidades'
        });
 
        connection.query('SELECT eta FROM dados_eta ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')
            }else{
                let mensagem = '';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].eta}\n`;
                }
                chat.sendMessage(mensagem);
                connection.end();

            }
            
        });
    }//Menu Processo
    else if(msg.body === '3'){
        chat.sendMessage('Você selecionou o Processo.\nAgora digite o número correspondente a sub-area desejada\r\n\r\n*3.1*-Brassagem\r\n\r\n*3.2*-Adega\r\n\r\n*3.3*-Adega Fermento\r\n\r\n*3.4*-Filtração\r\n\r\n*3.5*-Adega de Pressão\r\n\r\n*00*-Voltar ao menu inicial');
        
    }//Dados Brassagem
    else if(msg.body === '3.1'){
        //Cria conexão com o banco de dados.
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'brassagem'
        });
 
        connection.query('SELECT id, produto, CONVERT_TZ(hora_preenchimento, "+00:00", "America/Sao_Paulo") AS hora_local FROM tinasMostura', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = 'Arriadas até o momento:\n';
                for (let i = 0; i < results.length; i++) {
                mensagem += `ID: ${results[i].id}\n`;
                mensagem += `Produto: ${results[i].produto}\n`;
                mensagem += `Hora: ${results[i].hora_local}\n\n`;
                }
            
                chat.sendMessage(mensagem);
                connection.end();

            }
            
        });
    }//Dados Adega
    else if(msg.body === '3.2'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'processo'
        });

        connection.query('SELECT adega FROM dados_adega ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = '';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].adega}\n`; 
                }     
                chat.sendMessage(mensagem);
                connection.end();

            }
        

        });
    }//Dados Adega C fermento
    else if(msg.body === '3.3'){
        chat.sendMessage('Em breve!')
    }//Dados Filtração
    else if(msg.body === '3.4'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'processo'
        });

        connection.query('SELECT filt FROM dados_filt ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = '';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].filt}\n`; 
                }     
                chat.sendMessage(mensagem);
                connection.end();

            }
        

        });  
    }//Dados Adega de Pressão
    else if(msg.body === '3.5'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'processo'
        });

        connection.query('SELECT adp FROM dados_adp ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = 'Segue abaixo o Volume enviado para o Packaging.\n';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].adp}\n`; 
                }     
                chat.sendMessage(mensagem);
            }
        

        });
        connection.query('SELECT tanque_pressao FROM tp_adp ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let dadosTps = 'Segue abaixo dados dos Tanques de Pressão.\n';
                for (let i = 0; i < results.length; i++) {
                dadosTps += `${results[i].tanque_pressao}\n`; 
                }     
                chat.sendMessage(dadosTps);
                connection.end();

            }
        });   
    }//Menu Utilidades
    else if(msg.body === '4'){
        chat.sendMessage('Você selecionou Utilidades.\nAgora digite o número correspondente a sub-area desejada.\r\n\r\n*4.1*-Frio/Ar\r\n\r\n*4.2*-Co2\r\n\r\n*4.3*-Vapor\r\n\r\n*00*-Voltar ao menu inicial');
        
    }//Dados Frio/Ar
    else if(msg.body === '4.1'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'utilidades'
        });

        connection.query('SELECT frio_ar FROM dados_frio_ar ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = '';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].frio_ar}\n`; 
                }     
                chat.sendMessage(mensagem);
                connection.end();

            }
        });

    }//Dados Co2
    else if(msg.body === '4.2'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'utilidades'
        });

        connection.query('SELECT co2 FROM dados_co2 ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = '';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].co2}\n`; 
                }     
                chat.sendMessage(mensagem);
                connection.end();

            }
        });

    }//Dados Vapor
    else if (msg.body === '4.3'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'utilidades'
        });

        connection.query('SELECT vapor FROM dados_vapor ORDER BY id DESC LIMIT 1', function(error, results, fields){
            if(error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')
            }else{
                let mensagem = 'Segue abaixo os dados de VAPOR:\n';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].vapor}\n`; 
                }     
                chat.sendMessage(mensagem);
                connection.end();

            }
        });    

    }//Menu Packaging
    else if(msg.body === '5'){
        chat.sendMessage('Você selecionou o Packaging.\nAgora digite o número correspondente a sub-area desejada.\r\n\r\n*5.1*-Linha 501\r\n\r\n*5.2*-Linha 502\r\n\r\n*5.3*-Linha 511\r\n\r\n*5.4*-Linha 512\r\n\r\n*00*-Voltar ao menu inicial');
        
    }//Dados Packaging Linha 501
    else if(msg.body === '5.1'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'packaging_pb'
        });

        connection.query('SELECT horaria FROM horaria_501 ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = '';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].horaria}\n`; 
                }     
                chat.sendMessage(mensagem);
                connection.end();
            }
        
            
        });
    }//Dados Packaging linha 502    
    else if(msg.body === '5.2'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'packaging_pb'
        });

        connection.query('SELECT horaria FROM horaria_502 ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = '';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].horaria}\n`; 
                }     
                chat.sendMessage(mensagem);
                connection.end();

            } 
        });
    }//Dados Packaging linha 511
    else if(msg.body === '5.3'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'packaging_pb'
        });

        connection.query('SELECT horaria FROM horaria_511 ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            }else{
                let mensagem = '';
                for (let i = 0; i < results.length; i++) {
                mensagem += `${results[i].horaria}\n`; 
                }     
                chat.sendMessage(mensagem);
                connection.end();
            }
        
            
        });
    }//Dados Packaging linha 512
    else if(msg.body === '5.4'){
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: '10.205.20.230',
            user: 'root',
            password: '!ambev2021',
            database: 'packaging_pb'
        });

        connection.query('SELECT horaria FROM horaria_512 ORDER BY id DESC LIMIT 1', function (error, results, fields) {
            if (error){
                chat.sendMessage('Erro ao consultar nossa base de dados. Retorne o contato mais tarde!')

            };
        
            let mensagem = '';
            for (let i = 0; i < results.length; i++) {
            mensagem += `${results[i].horaria}\n`; 
            }     
            chat.sendMessage(mensagem);
            connection.end();
        });
    }//Menu oficinas
    else if(msg.body === '6'){
        chat.sendMessage('Você selecionou Oficina.\nAgora digite o número correspondente a sub-area desejada\r\n\r\n*6.1*-Sala de Motores\r\n\r\n*6.2*-Solicitação Automação\r\n\r\n*6.3*- Solicitação Rebobinamento\r\n\r\n*00*-Voltar ao menu inicial');

    }//Gestão Sala de motores.
    else if(msg.body === '6.1'){
        chat.sendMessage('*Planilha de Gestão da sala de Motores.*\nhttps://anheuserbuschinbev.sharepoint.com/:x:/r/sites/aguasclaresse/Manuteno/Confiabilidade/Controle%20de%20motores%20el%C3%A9tricos/Controle%20de%20Sala%20de%20motores%20.xlsx?d=w180680a6c19844f9a0470cfdbe939c28&csf=1&web=1&e=VjNBf1')

    }//Solicitação de alteração de Lógica automação
    else if(msg.body === '6.2'){
        chat.sendMessage('*Solicitação para alteração de Lógica de Automação*\nhttps://forms.office.com/Pages/ResponsePage.aspx?id=GUvwznZ3lEq4mzdcd6j5NniSpA5KU0xKpqz6MWCY0RpUNU1WTzFOV0Y4NzhNOFpIWEJQQUY5MkM4Mi4u')

    }//Forms Rebobinamento de motores
    else if(msg.body === '6.3'){
        chat.sendMessage('*Forms para solicitação de Rebobinamento de motores.*\nhttps://forms.office.com/pages/responsepage.aspx?id=GUvwznZ3lEq4mzdcd6j5NmolyZG4JNhBkjGiakOLRxVUQkRXTTNUQVM3UU9LR0gxM1E0N0VHSTUzTi4u')       

    }//Menu Manutenção
    else if(msg.body === '7'){
        chat.sendMessage('Você selecionou Manutenção.\nAgora digite o número correspondente a sub-area desejada\r\n\r\n*7.1*-Forms Check de ATO\r\n\r\n*00*-Voltar ao menu inicial');

    }//Forms Check de ATO.
    else if(msg.body === '7.1'){
        chat.sendMessage('*Check de ATO.*\nhttps://forms.office.com/r/dXrupNrFTb')

    }//Alerta Vazão de Captação co2(em testes)
    else if(vazaoCaptacao < 0){
        let number = '557999334062@c.us';
        let message = 'Baixa vazão de captação de co2.\nVazão: ' + `${vazaoCaptacao}`;
        client.sendMessage(number, message);
        console.log(vazaoCaptacao);

    }//Retorna ao Menu inicial
    else if(msg.body === "00"){
        chat.sendMessage('Digite o número correspondente a área que deseja consultar.\r\n\r\n*1*-Segurança.\r\n\r\n*2*-Meio Ambiente.\r\n\r\n*3*-Processo.\r\n\r\n*4*-Utilidades.\r\n\r\n*5*-Packaging');
    }
    else if (msg.body === '!buttons') {
        let button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');
        client.sendMessage(msg.from, button);
    }
    else if (msg.body === '!list') {
        let sections = [{ title: 'Selecione a área', rows: [{ title: '1', description: 'Meio Ambiente' }, { title: '2', description: 'Processo' }] }];
        let list = new List('Selecione a área que deseja consultar', 'Opções', sections, 'Menu', 'footer');
        client.sendMessage(msg.to, list);
    
    }
});
