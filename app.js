const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Define a porta do servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor Porta ${port}`);
});

// Define a pasta pública como o local para servir arquivos estáticos
app.use(express.static('public'));

// Cria a conexão com a base de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'futebol'
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
  

// Define a rota para adicionar jogadores
app.post('/adicionarJogador', (req, res) => {
    const name = req.body.name.trim();
    const birthdate = req.body.birthdate;
    const country = req.body.country.trim();
    const height = parseInt(req.body.height);
    const position = req.body.position;
  
    console.log(name, birthdate, country, height, position); // Verifica se os dados estão sendo recebidos corretamente
  
    if (!name || !birthdate || !country || !height || !position) {
      res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      return;
    }
  
    connection.query('INSERT INTO jogadores (name, birthdate, country, height, position, teamMember) VALUES (?, ?, ?, ?, ?, ?)', [name, birthdate, country, height, position, false], (error, results) => {
        if (error) {
          console.error(error); // Adiciona um log do erro 
          res.status(500).json({ error: 'Não foi possível adicionar o jogador.' });
          return;
        }
      
      console.log(results); // Adiciona um log dos resultados para verificar se a inserção foi bem sucedida
      res.json({ message: 'Jogador adicionado com sucesso!' });
    });
  });

  //obtem os jogadores para JSON
  app.get('/jogadores', (req, res) => {
    connection.query('SELECT name, TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) as age, country, height, position FROM jogadores', (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Não foi possível obter os jogadores.' });
        return;
      }
  
      res.json(results);
    });
  });


// Define a rota para editar jogadores
app.post('/editarJogador', (req, res) => {
  const id = parseInt(req.body.id);
  const name = req.body.name.trim();
  const birthdate = req.body.birthdate;
  const country = req.body.country.trim();
  const height = parseInt(req.body.height);
  const position = req.body.position;

  console.log(id, name, birthdate, country, height, position); // Verifica se os dados estão sendo recebidos corretamente

  if (!id) {
    res.status(400).json({ error: 'O campo ID é obrigatório.' });
    return;
  }

  const valuesToUpdate = {};

  if (name) {
    valuesToUpdate.name = name;
  }

  if (birthdate) {
    valuesToUpdate.birthdate = birthdate;
  }

  if (country) {
    valuesToUpdate.country = country;
  }

  if (height) {
    valuesToUpdate.height = height;
  }

  if (position) {
    valuesToUpdate.position = position;
  }

  if (Object.keys(valuesToUpdate).length === 0) {
    res.status(400).json({ error: 'Nenhum campo foi preenchido para atualização.' });
    return;
  }

  connection.query('UPDATE jogadores SET ? WHERE id = ?', [valuesToUpdate, id], (error, results) => {
    if (error) {
      console.error(error); // Adiciona um log do erro 
      res.status(500).json({ error: 'Não foi possível atualizar o jogador.' });
      return;
    }

    console.log(results); // Adiciona um log dos resultados para verificar se a atualização
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Jogador não encontrado.' });
      return;
    }
    res.json({ message: 'Jogador atualizado com sucesso!' });
  });
});


// Define a rota para excluir jogadores
app.post('/apagarJogador', (req, res) => {
  const id = parseInt(req.body.id);

  console.log(id); // Verifica se o ID está sendo recebido corretamente

  if (!id) {
    res.status(400).json({ error: 'O ID do jogador é obrigatório.' });
    return;
  }

  connection.query('DELETE FROM jogadores WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error(error); // Adiciona um log do erro 
      res.status(500).json({ error: 'Não foi possível excluir o jogador.' });
      return;
    }

    console.log(results); // Adiciona um log dos resultados para verificar se a exclusão foi realizada
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Jogador não encontrado.' });
      return;
    }
    res.json({ message: 'Jogador excluído com sucesso!' });
  });
});



// Função para verificar se o jogador existe
app.get('/apagarJogador', (req, res) => {
  const playerId = req.query.id;

  // Executar comando SQL para apagar jogador
  const sql = `DELETE FROM jogadores WHERE id = ${playerId}`;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Erro ao apagar jogador:', error);
      res.status(500).json({ error: 'Erro ao apagar jogador' });
    } else {
      // Jogador apagado com sucesso
      res.json({ message: 'Jogador apagado com sucesso' });
    }
  });
});

  
  


