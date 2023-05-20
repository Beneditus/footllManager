//Script para navigation bar
class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";

    this.handleClick = () => {
      this.navList.classList.toggle(this.activeClass);
      this.mobileMenu.classList.toggle(this.activeClass);
      this.animateLinks();
    };

    this.animateLinks = () => {
      this.navLinks.forEach((link, index) => {
        link.style.animation = link.style.animation ? "" : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      });
    };
  }

  addClickEvent = () => {
    this.mobileMenu.addEventListener("click", this.handleClick);
  };

  init = () => {
    if (this.mobileMenu) {
      this.addClickEvent();
    }
    return this;
  };
}

const mobileNavbar = new MobileNavbar(".mobileMenu", ".navList", ".navList li");
mobileNavbar.init();

//#region Form Functions

const openForm = (buttonsClass, formsClass, containerID, selectedFormID, selectedButtonID) => {
  var buttons = document.querySelectorAll(buttonsClass)
  var forms = document.querySelectorAll(formsClass)
  var container = document.querySelector(containerID)
  var selectedForm = document.querySelector(selectedFormID);
  var selectedButton = document.querySelector(selectedButtonID);

  container.style.display = "flex";

  forms.forEach(form => form.style.display = "none")

  buttons.forEach(button => button.style.display = "none")

  selectedForm.style.display = "flex"
  selectedButton.style.display = "block"

  selectedButton.onclick = () => closeForm(buttonsClass, formsClass, containerID, selectedFormID, selectedButtonID);
}

const closeForm = (buttonsClass, formsClass, containerID, selectedFormID, selectedButtonID) => {
  var buttons = document.querySelectorAll(buttonsClass)
  var container = document.querySelector(containerID)
  var selectedButton = document.querySelector(selectedButtonID)
  var forms = document.querySelectorAll(formsClass)
  container.style.display = "none";

  forms.forEach(form => form.style.display = "none")

  buttons.forEach(button => button.style.display = "block")

  selectedButton.onclick = () => openForm(buttonsClass, formsClass, containerID, selectedFormID, selectedButtonID);
}

var modoTeste = true 

const allButtonsPlayers = document.querySelectorAll(".buttonPlayer");
const allButtonsTeams = document.querySelectorAll(".buttonTeams");
const allButtonsCampeonatos = document.querySelectorAll(".buttonCampeonato")

allButtonsPlayers.forEach(button => {
  button.onclick = () => openForm(".buttonPlayer", ".formsPlayers", "#formContainerPlayers", "#" + button.id + "Form", "#" + button.id)
})

allButtonsTeams.forEach(button => {
  button.onclick = () => openForm(".buttonTeams", ".formsTeams", "#formContainerTeams", "#" + button.id + "Form", "#" + button.id)
})

allButtonsCampeonatos.forEach(button => {
  button.onclick = () => openForm(".buttonCampeonatos", ".formsCampeonatos", "#formContainerCampeonatos", "#" + button.id + "Form", "#" + button.id)
})
//#endregion

//#region Navbar links
const links = document.querySelectorAll('.navItem');
links.forEach(link => link.onclick = () => toggleSections("#" + link.id.replace("link","section")))

const toggleSections = (sectionID) => {
  const allSections = document.querySelectorAll(".section")
  const selectedSection = document.querySelector(sectionID)
  allSections.forEach(section => section.style.display = "none")
  selectedSection.style.display = "flex"

  //Esconder detalhes do campeonato caso esteja aberto
  document.querySelector(".closeButton").click()
};

//#endregion

//#region Tabelas

const mostrarDadosCampeonatos = () => {
  const campeonatosTable = document.querySelector('#campeonatosTable');
  campeonatosTable.innerHTML = '';

  let campeonatos = localStorage.getItem('campeonatos');

  if (campeonatos) {
    campeonatos = JSON.parse(campeonatos);

    campeonatos.forEach((campeonato) => {
      const { id, name, edition, winner, estado} = campeonato;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${edition}</td>
        <td>${winner.name || "---"}</td>
        <td>${estado}</td>
      `;
      campeonatosTable.appendChild(row);
    });
  }
}


// Função para mostrar os dados dos jogadores na tabela
const mostrarDadosPlayers = () => {
  const jogadoresTable = document.querySelector('#playersTableBody');
  jogadoresTable.innerHTML = '';

  let jogadores = localStorage.getItem('jogadores');

  if (jogadores) {
    jogadores = JSON.parse(jogadores);

    jogadores.sort((jogadorA, jogadorB) => {
      if (jogadorA.id < jogadorB.id)
        return -1;

      if (jogadorA.id > jogadorB.id)
        return 1;

      return 0;
    })

    jogadores.forEach((jogador) => {
      const { id, name, birthdate, country, height, position, team } = jogador;


      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${calcularIdade(birthdate)}</td>
        <td>${country}</td>
        <td>${height}</td>
        <td>${position}</td>
        <td>${team}</td>
      `;

      jogadoresTable.appendChild(row);
    });
  }
};


// Função para mostrar os dados dos jogadores na tabela
const mostrarDadosEquipas = () => {
  const equipasTable = document.querySelector('#teamTableBody');
  equipasTable.innerHTML = '';

  let equipas = localStorage.getItem('equipas');

  if (equipas) {
    equipas = JSON.parse(equipas);

    equipas.sort((equipaA, equipaB) => {
      if (equipaA.id < equipaB.id)
        return -1;

      if (equipaA.id > equipaB.id)
        return 1;

      return 0;
    })

    equipas.forEach((equipa) => {
      const { id, name, acronimo, country, descricao, players, url } = equipa;

      var playerNames = "";

      if(!players || players?.length < 1) playerNames = "Sem Jogadores"
      else {
        players.forEach(player => playerNames += player.name + "; ")
      }
    
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${acronimo}</td>
        <td>${url}</td>
        <td>${country}</td>
        <td>${descricao}</td>
        <td>${playerNames}</td>
      `;

      equipasTable.appendChild(row);
    });
  }
};

const mostrarEquipasDisponiveis = () => {

  const paisesTable = document.querySelector('#campeonatosEquipasTable');
  paisesTable.innerHTML = '';

  let equipas = localStorage.getItem('equipas');

  if (equipas) {
    equipas = JSON.parse(equipas);

    equipas.sort((equipaA, equipaB) => {
      if (equipaA.id < equipaB.id)
        return -1;

      if (equipaA.id > equipaB.id)
        return 1;

      return 0;
    })

    equipasDisponveisCampeonato = []
    equipas.forEach((equipa) => {
      if(equipa.players?.length < 11) return
      equipasDisponveisCampeonato.push(equipa)
      if(paisFiltro.value != "todos" && equipa.country != paisFiltro.value) return;


      const { id, name} = equipa;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
      `;

      paisesTable.appendChild(row);
    });
  }
}

//#endregion

// Função para criar um ID único para cada jogador
const criarID = (values) => {
  const valuesString = localStorage.getItem(values);
  if (valuesString) {
    const valuesArray = JSON.parse(valuesString);
    var id = 1
    do{
      if(valuesArray.every(obj => obj.id != id)) return id;
      else id++
    }while(true)
  }
  return 1;
};

// Função para guardar informações do jogador em localStorage
const validarIdade = (birthdateInput) => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 50, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

  const selectedDate = new Date(birthdateInput.value);
  if (selectedDate < minDate || selectedDate > maxDate) {
    birthdateInput.setCustomValidity('A idade do jogador deve estar entre 16 e 50 anos.');
    alert('Idade inválida. A idade do jogador deve estar entre 16 e 50 anos.');
    return false;
  } else {
    birthdateInput.setCustomValidity('');
    return true;
  }
};

const editarPlayerTeam = (idPlayer, idEquipa) => {
  var jogadores = localStorage.getItem("jogadores")
  var equipas = localStorage.getItem("equipas")

  if(!jogadores){
    alert("Jogador não existe!")
    return false;
  }

  jogadores = JSON.parse(jogadores)
  var jogador = jogadores.find(jogador => jogador.id == idPlayer)
  var indexJogador = jogadores.indexOf(jogador)

  if(!jogador){
    alert("Jogador não existe!")
    return false;
  }

  if(!equipas){
    alert("Equipa não existe!")
    return false;
  }

  equipas = JSON.parse(equipas)

  if(idEquipa == 0){
    if(jogador.team == "Sem Equipa"){
      alert("Jogador não pertence a nenhuma equipa!")
      return false;
    }

    var currentTeam = equipas.find(equipa => equipa.name == jogador.team)
    var currentTeamIndex = equipas.indexOf(currentTeam)
    var indexJogadorEquipa = currentTeam.players.findIndex(jogador => jogador.id == idPlayer);

    equipas[currentTeamIndex].players.splice(indexJogadorEquipa, 1)
    jogadores[indexJogador].team = "Sem Equipa"

    localStorage.setItem("equipas", JSON.stringify(equipas))
    localStorage.setItem("jogadores", JSON.stringify(jogadores))
  }
  else{
    //Nova equipa
    var newTeam = equipas.find(equipa => equipa.id == idEquipa)
    var newTeamIndex = equipas.indexOf(newTeam)

    if(!newTeam){
      alert("Equipa não existe!")
      return false;
    }

    //Equipa atual
    if(jogador.team != "Sem Equipa"){
      var currentTeam = equipas.find(equipa => equipa.name == jogador.team)
      var currentTeamIndex = equipas.indexOf(currentTeam)
      var indexJogadorEquipa = currentTeam.players.findIndex(jogador => jogador.id == idPlayer);

      window.alert("currentTeam: " + currentTeam.team + "\ncurrentTeamIndex: " + currentTeamIndex + "\nindexJogadorEquipa: " + indexJogadorEquipa )
      equipas[currentTeamIndex].players.splice(indexJogadorEquipa, 1)
    }

    jogadores[indexJogador].team = newTeam.name;

    equipas[newTeamIndex].players.push(jogador)

    localStorage.setItem("equipas", JSON.stringify(equipas))
    localStorage.setItem("jogadores", JSON.stringify(jogadores))
  }
/*
  var equipa = equipas.find(equipa => equipa.name == nameEquipa)
  var indexEquipa = equipas.indexOf(equipa)*/
}

//#region Forms Players
const formAdicionarPlayer = document.querySelector('#addPlayerForm');

//Adicionar jogador
formAdicionarPlayer.addEventListener('submit', (event) => {
  event.preventDefault();

  const birthdateInput = document.querySelector('#playerBirthdate');
  const isidadeValida = validarIdade(birthdateInput);

  const idEquipa = document.querySelector("#playerTeam").value;

  if (isidadeValida) {
    const jogador = {
      id: criarID("jogadores"),
      name: document.querySelector('#playerName').value,
      birthdate: document.querySelector('#playerBirthdate').value,
      country: document.querySelector('#playerCountry').value,
      height: document.querySelector('#playerHeight').value,
      position: document.querySelector('#playerPosition').value,
      team: "Sem Equipa"
    };
  
    let jogadores = localStorage.getItem('jogadores');

    if (jogadores) {
      jogadores = JSON.parse(jogadores);
    } else {
      jogadores = [];
    }

    jogadores.push(jogador);
    
    localStorage.setItem('jogadores', JSON.stringify(jogadores));

    editarPlayerTeam(jogador.id, idEquipa)

    alert('Jogador adicionado com sucesso!');
    atualizarTabelas()
  }
});

// Função para editar os dados de um jogador pelo ID
const editForm = document.querySelector('#editPlayerForm');

editForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const editId = document.querySelector('#editPlayerId').value;
  const editPlayerTeam = document.querySelector('#editPlayerTeam').value;

  const birthdateInput = document.querySelector('#editPlayerBirthdate');
  const isidadeValida = validarIdade(birthdateInput);

  if (isidadeValida) {
    let jogadores = localStorage.getItem('jogadores');

    if (jogadores) {
      jogadores = JSON.parse(jogadores);

      const index = jogadores.findIndex((jogador) => jogador.id == editId);

      if (index !== -1) {
        jogadores[index].name = document.querySelector('#editPlayerName').value;
        jogadores[index].birthdate = document.querySelector('#editPlayerBirthdate').value;
        jogadores[index].country = document.querySelector('#editPlayerCountry').value;
        jogadores[index].height = document.querySelector('#editPlayerHeight').value;
        jogadores[index].position = document.querySelector('#editPlayerPosition').value;

        localStorage.setItem('jogadores', JSON.stringify(jogadores));

        editarPlayerTeam(jogadores[index].id, editPlayerTeam)

        alert('Jogador atualizado com sucesso!');
        atualizarTabelas()
      }
    }
  }
});

const removeForm = document.querySelector('#removePlayerForm');

removeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const deleteId = document.querySelector('#deletePlayerId').value;

  let jogadores = localStorage.getItem('jogadores');

  if (jogadores) {
    jogadores = JSON.parse(jogadores);

    const index = jogadores.findIndex((jogador) => jogador.id == deleteId);
    var jogador = jogadores[index]
    if (index !== -1) {
      editarPlayerTeam(jogador.id, 0)

      jogadores.splice(index, 1);
      localStorage.setItem('jogadores', JSON.stringify(jogadores));
      alert('Jogador removido com sucesso!');
      atualizarTabelas()
    } else {
      alert('Jogador não encontrado!');
    }
  } else {
    alert('Jogador não encontrado!');
  }
});

//#endregion

// Função para calcular a idade com base na data de nascimento
const calcularIdade = (birthdate) => {
  const hoje = new Date();
  const dataNascimento = new Date(birthdate);
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();
  const mesNascimento = dataNascimento.getMonth();
  const diaNascimento = dataNascimento.getDate();

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade--;
  }

  return idade;
};

//Scripts Equipas
const formAdicionarEquipa = document.querySelector('#addTeamForm');

//Adicionar equipa
formAdicionarEquipa.addEventListener('submit', (event) => {
  event.preventDefault();

  var jogadorDisponivel = true;

    const equipa = {
      id: criarID("equipas"),
      name: document.querySelector('#addTeamName').value,
      acronimo: document.querySelector('#addTeamAcronimo').value,
      country: document.querySelector('#addTeamCountry').value,
      descricao: document.querySelector('#addTeamDescricao').value,
      url: document.querySelector('#addTeamURL').value,
      players: []
    };

    let equipas = localStorage.getItem('equipas');

    if (equipas) {
      equipas = JSON.parse(equipas);
    } else {
      equipas = [];
    }

    if(equipas.some(equipaExistente => equipaExistente.name == equipa.name)){
      alert("Equipa já existe!")
      return;
    }

    equipas.push(equipa);

    var allPlayers = localStorage.getItem("jogadores")
    var teamPlayers = document.querySelector("#addTeamPlayers").value

    if(teamPlayers.length != 0){
    
    teamPlayers = teamPlayers.split(",")
    if(!allPlayers){
      alert("Não existem jogadores!")
      return;
    }

    allPlayers = JSON.parse(allPlayers);
  
    teamPlayers.forEach(teamPlayer => {
      if(allPlayers.every(player => player.id != teamPlayer)){
        alert("Jogador não existe!")
        jogadorDisponivel = false;
      }
      if(allPlayers.some(player => player.team != "Sem Equipa")){
        alert("Jogador não disponivel!")
        jogadorDisponivel = false;
      }
    })
    }
    
    if(!jogadorDisponivel) return;

    localStorage.setItem('equipas', JSON.stringify(equipas));

    if(teamPlayers != ""){
      teamPlayers.forEach(idJogador => editarPlayerTeam(idJogador, equipa.id))
    }
    alert('Equipa adicionada com sucesso!');
    atualizarTabelas()
});

const removeTeamForm = document.querySelector('#removeTeamForm');

removeTeamForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const deleteId = document.querySelector('#deleteTeamId').value;

  let equipas = localStorage.getItem('equipas');

  if (equipas) {
    equipas = JSON.parse(equipas);

    const index = equipas.findIndex((equipa) => equipa.id == deleteId);
    var equipa = equipas[index]
    if (index !== -1) {

      equipa.players.forEach(player => editarPlayerTeam(player.id, ""))

      equipas.splice(index, 1);

      localStorage.setItem('equipas', JSON.stringify(equipas));

      alert('Equipa removida com sucesso!');
      atualizarTabelas()
    } else {
      alert('Equipa não encontrada!');
    }
  } else {
    alert('Equipa não encontrada!');
  }
});

const editTeamForm = document.querySelector('#editTeamForm');

editTeamForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const editId = document.querySelector('#editTeamId').value;

  let equipas = localStorage.getItem('equipas');

  if (equipas) {
    equipas = JSON.parse(equipas);

    const index = equipas.findIndex((equipa) => equipa.id == editId);

    if (index !== -1) {
      equipas[index].name = document.querySelector('#editTeamName').value;
      equipas[index].acronimo = document.querySelector('#editTeamAcronimo').value;
      equipas[index].url = document.querySelector('#editTeamURL').value;
      equipas[index].country = document.querySelector('#editTeamCountry').value;
      equipas[index].descricao = document.querySelector('#editTeamDescricao').value;

      localStorage.setItem('equipas', JSON.stringify(equipas));

      alert('Equipa atualizada com sucesso!');
      atualizarTabelas()
    }
    else 
      alert('Equipa não existe!');
  }
});

const paisFiltro = document.querySelector("#paisFiltro")

paisFiltro.addEventListener("change", () => mostrarEquipasDisponiveis())
var equipasDisponveisCampeonato = []

const addCampeonatoForm = document.querySelector('#addCampeonatoForm');

addCampeonatoForm.addEventListener('submit', (event) => {
  event.preventDefault();

    const campeonato = {
      id: criarID("campeonatos"),
      name: document.querySelector('#addCampeonatoName').value,
      edition: document.querySelector('#addCampeonatoEdition').value,
      members: [],
      matches: [],
      currentBracket: "Oitavos de Final",
      winner: "---",
      estado: "Em preparação"
    };

    var membros = document.querySelector('#addCampeonatoTeams').value.split(",")

    //Numero de equipas errado
    if(membros.length != 16)
    {
      alert("O campeonato tem que ter 16 equipas!")
      return
    }

    //Equipas repetidas
    if(membros.length != new Set(membros).size){
      alert("As equipas não podem estar repetidas!")
      return
    }

    //Equipas estão disponiveis
    var equipaIndisponiveis = []
    membros.forEach(membro => {
      if(equipasDisponveisCampeonato.every(equipa => equipa.id != membro)){
        equipaIndisponiveis.push(membro)
      }
    })
    
    if(equipaIndisponiveis.length != 0){
      alert(`A(s) equipa(s) ${equipaIndisponiveis.join(", ")} estão indisponiveis`)
      return;
    }

    membros.forEach(membro => {
      var novaEquipa =equipasDisponveisCampeonato.find(equipa => equipa.id == membro)
      campeonato.members.push(novaEquipa)
    })

    let campeonatos = localStorage.getItem('campeonatos');

    if (campeonatos) {
      campeonatos = JSON.parse(campeonatos);
    } else {
      campeonatos = [];
    }

    campeonatos.push(campeonato);

    localStorage.setItem('campeonatos', JSON.stringify(campeonatos));

    alert('Campeonato adicionado com sucesso!');
    atualizarTabelas()
});

const verCampeonatoForm = document.querySelector('#verCampeonatoForm');

verCampeonatoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  allCampeonatos = localStorage.getItem("campeonatos")

  if(allCampeonatos){
    allCampeonatos = JSON.parse(allCampeonatos);
    const idCampeonato = document.querySelector("#verCampeonatoID").value;

    var campeonato = allCampeonatos.findIndex( camp => camp.id == idCampeonato)
    if(campeonato != -1){
      document.querySelector("#campeonatoContainer").style.display = "flex"
      document.querySelector(".upperSection").style.display = "none"

      document.querySelector(".simulateBracket").onclick = () => simularFase(allCampeonatos[campeonato])
      atualizarBrackets(allCampeonatos[campeonato])
    }
    else {
      alert("Campeonato não existe!")
      return
    }
  }
  else {
    alert("Campeonato não existe!")
    return
  }
});

const atualizarTabelas = () =>{
  mostrarDadosPlayers()
  mostrarDadosEquipas()
  mostrarDadosCampeonatos()
  mostrarEquipasDisponiveis()
}

atualizarTabelas();

const simularJogo = (equipa1, equipa2, bracket) => {
  
  var golosEquipa1;
  var golosEquipa2;
  
  do{
    golosEquipa1 = Math.floor(Math.random() * 7)
    golosEquipa2 = Math.floor(Math.random() * 7)
  }while(golosEquipa1 == golosEquipa2)

  var winner = golosEquipa1 > golosEquipa2 ? equipa1 : equipa2;

  return{
    equipa1: {name: equipa1.name, golos: golosEquipa1},
    equipa2: {name: equipa2.name, golos: golosEquipa2},
    winner: winner,
    bracket: bracket
  }
}

const simularFase = (campeonato) => {
  var matches = campeonato.matches;
  var availableTeams = [];
  var campeonatos = JSON.parse(localStorage.getItem("campeonatos"))
  var indexCampeonato = campeonatos.findIndex(camp => camp.id == campeonato.id);

  switch(campeonato.currentBracket){
    case "Oitavos de Final":{
      availableTeams = campeonato.members
      
      for(i = 0; i < 8; i++){
        
        var equipa1 = availableTeams[Math.floor(Math.random() * availableTeams.length)]
        availableTeams.splice(availableTeams.indexOf(equipa1), 1)

        var equipa2 = availableTeams[Math.floor(Math.random() * availableTeams.length)]
        availableTeams.splice(availableTeams.indexOf(equipa2), 1)

        matches.push(simularJogo(equipa1, equipa2, "Oitavos de Final"))
      }

      campeonatos[indexCampeonato].matches = matches;
      campeonatos[indexCampeonato].currentBracket = "Quartos de Final"
      campeonatos[indexCampeonato].estado = "Em Competição"

      break
    }
    case "Quartos de Final":{
      campeonato.matches.forEach(match =>{
        if(match.bracket == "Oitavos de Final")
        availableTeams.push(match.winner)
      })
      
      for(i = 0; i < 4; i++){
        
        var equipa1 = availableTeams[0 + i*2]
        var equipa2 = availableTeams[1 + i*2]

        matches.push(simularJogo(equipa1, equipa2, "Quartos de Final"))
      }

      campeonatos[indexCampeonato].matches = matches;
      campeonatos[indexCampeonato].currentBracket = "Meias Finais"
      break
    }
    case "Meias Finais":{
      campeonato.matches.forEach(match =>{
        if(match.bracket == "Quartos de Final")
        availableTeams.push(match.winner)
      })
      
      for(i = 0; i < 2; i++){
        var equipa1 = availableTeams[0 + i*2]
        var equipa2 = availableTeams[1 + i*2]

        matches.push(simularJogo(equipa1, equipa2, "Meias Finais"))
      }

      campeonatos[indexCampeonato].matches = matches;
      campeonatos[indexCampeonato].currentBracket = "Final"
      break
    }    
    case "Final":{
      campeonato.matches.forEach(match =>{
        if(match.bracket == "Meias Finais")
        availableTeams.push(match.winner)
      })
    
        var equipa1 = availableTeams[0]
        var equipa2 = availableTeams[1]

        var finalMatch = simularJogo(equipa1, equipa2, "Final")
        matches.push(finalMatch)
      

      var campeonatos = JSON.parse(localStorage.getItem("campeonatos"))
      var indexCampeonato = campeonatos.findIndex(camp => camp.id == campeonato.id);

      campeonatos[indexCampeonato].matches = matches;
      campeonatos[indexCampeonato].currentBracket = "Finished"
      campeonatos[indexCampeonato].winner = finalMatch.winner
      campeonatos[indexCampeonato].estado = "Terminado"
      break
    }
    case "Finished":
      window.alert("Campeonato já terminou!")
      break
  }

  document.querySelector(".simulateBracket").onclick = () => simularFase(campeonatos[indexCampeonato])

  localStorage.setItem("campeonatos", JSON.stringify(campeonatos))
  atualizarBrackets(campeonato)
}

const atualizarBrackets = (campeonato) => {
  var bracket;
  document.querySelector("#oitavosBracket").innerHTML = '<span class="bracketTitle"> Oitavos de Final</span>'
  document.querySelector("#quartosBracket").innerHTML = '<span class="bracketTitle"> Quartos de Final</span>'
  document.querySelector("#meiasBracket").innerHTML = '<span class="bracketTitle"> Meias Finais</span>'
  document.querySelector("#finalBracket").innerHTML = '<span class="bracketTitle"> Final</span>'

  campeonato.matches.forEach(match => {

    switch(match.bracket){
      case "Oitavos de Final":
        bracket = document.querySelector("#oitavosBracket")
        break

      case "Quartos de Final":
        bracket = document.querySelector("#quartosBracket")
        break

      case "Meias Finais":
        bracket = document.querySelector("#meiasBracket")
        break

      case "Final":
        bracket = document.querySelector("#finalBracket")
        break
    }

    const equipa1Row = document.createElement('div');
    equipa1Row.innerHTML = `<span> ${match.equipa1.name}</span> <span> ${match.equipa1.golos} </span>`
    if(match.equipa1.name == match.winner.name) equipa1Row.classList="bold"

    const equipa2Row = document.createElement('div');
    equipa2Row.innerHTML = `<span> ${match.equipa2.name}</span> <span> ${match.equipa2.golos} </span>`
    if(match.equipa2.name == match.winner.name) equipa2Row.classList="bold"

    const card = document.createElement('div');
      card.classList = "matchCard"
      card.appendChild(equipa1Row)
      card.appendChild(equipa2Row)
      bracket.appendChild(card);
  })
}

document.querySelector(".closeButton").addEventListener("click", () => {
  document.querySelector("#campeonatoContainer").style.display = "none"
  document.querySelector(".upperSection").style.display = "flex"
})

if(modoTeste){
  localStorage.removeItem("jogadores");
  var jogadores = []

  for(i = 1; i <= 176; i++){
    const jogador = {
      birthdate: "2000-01-01",
      country: "Portugal",
      height: "180",
      id: i,
      name: "Jogador " + i,
      position: "DF",
      team: "Sem Equipa"
    }
    jogadores.push(jogador)
  }

  localStorage.setItem("jogadores", JSON.stringify(jogadores))

  localStorage.removeItem("equipas");
  var equipas = []

  for(i = 1; i <= 16; i++){
    const equipa = {
      id: i,
      name: "Equipa " + i,
      acronimo: "lol",
      country: "Portugal",
      descricao: "Descrição" + i,
      url: "google.com",
      players: []
    };
    equipas.push(equipa)
  }
  
  localStorage.setItem("equipas", JSON.stringify(equipas))

  jogadores = JSON.parse(localStorage.getItem("jogadores"))

  for(i = 0; i < 16; i++){
    for(x = 0; x < 11; x++)
      editarPlayerTeam(jogadores[x+(i*11)].id,equipas[i].id)
  }
  atualizarTabelas()
}