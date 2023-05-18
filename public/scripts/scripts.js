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

  console.log(selectedButton)
  selectedForm.style.display = "flex"
  selectedButton.style.display = "block"

  selectedButton.onclick = () => closeForm(buttonsClass, formsClass, containerID, selectedFormID, selectedButtonID);
}

const closeForm = (buttonsClass, formsClass, containerID, selectedFormID, selectedButtonID) => {
  var buttons = document.querySelectorAll(buttonsClass)
  var container = document.querySelector(containerID)
  var selectedButton = document.querySelector(selectedButtonID)
  var forms = document.querySelectorAll(formsClass)

  console.log(buttons)
  container.style.display = "none";

  forms.forEach(form => form.style.display = "none")

  buttons.forEach(button => button.style.display = "block")

  selectedButton.onclick = () => openForm(buttonsClass, formsClass, containerID, selectedFormID, selectedButtonID);
}



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
};

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

//#region Forms Players
const formAdicionarPlayer = document.querySelector('#addPlayerForm');

//Adicionar jogador
formAdicionarPlayer.addEventListener('submit', (event) => {
  event.preventDefault();

  const birthdateInput = document.querySelector('#playerBirthdate');
  const isidadeValida = validarIdade(birthdateInput);

  const idEquipa = document.querySelector("#playerTeam").value;

  var newTeam;
  var newTeamIndex;
  if(idEquipa){
    var allTeams = localStorage.getItem("equipas")

    if(allTeams){
      allTeams = JSON.parse(allTeams)

      if(allTeams.every(team => team.id != idEquipa))
      {
        alert('Equipa não existe!');
        return;
      }
      else{
        newTeam = allTeams.find(team => team.id == idEquipa)

        if(newTeam.players?.length >= 11){ 
          alert('Equipa está cheia!');
          return;
        }
        newTeamIndex = allTeams.indexOf(newTeam);
      }
    }
    else{
      alert('Equipa não existe!');
      return;
    }
  } 
  if (isidadeValida) {
    const jogador = {
      id: criarID("jogadores"),
      name: document.querySelector('#playerName').value,
      birthdate: document.querySelector('#playerBirthdate').value,
      country: document.querySelector('#playerCountry').value,
      height: document.querySelector('#playerHeight').value,
      position: document.querySelector('#playerPosition').value,
      team: newTeam?.name || "Sem Equipa"
    };
  
    let jogadores = localStorage.getItem('jogadores');

    if (jogadores) {
      jogadores = JSON.parse(jogadores);
    } else {
      jogadores = [];
    }

    jogadores.push(jogador);

    if(idEquipa){
      if(newTeam.players)
        newTeam.players.push(jogador)
      else{
        newTeam.players = []
        newTeam.players.push(jogador)
      }

      allTeams[newTeamIndex] = newTeam;
      localStorage.setItem("equipas", JSON.stringify(allTeams))
      mostrarDadosEquipas();
    }
    
    localStorage.setItem('jogadores', JSON.stringify(jogadores));
    mostrarDadosPlayers();
    alert('Jogador adicionado com sucesso!');
  }
});

// Função para editar os dados de um jogador pelo ID
const editarJogador = () => {
  const editForm = document.querySelector('#editPlayerForm');

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const editId = document.querySelector('#editPlayerId').value;
    const editName = document.querySelector('#editPlayerName').value;
    const editBirthdate = document.querySelector('#editPlayerBirthdate').value;
    const editCountry = document.querySelector('#editPlayerCountry').value;
    const editHeight = document.querySelector('#editPlayerHeight').value;
    const editPosition = document.querySelector('#editPlayerPosition').value;

    const birthdateInput = document.querySelector('#editPlayerBirthdate');
    const isidadeValida = validarIdade(birthdateInput);

    if (isidadeValida) {
      let jogadores = localStorage.getItem('jogadores');

      if (jogadores) {
        jogadores = JSON.parse(jogadores);

        const index = jogadores.findIndex((jogador) => jogador.id.toString() === editId);

        if (index !== -1) {
          jogadores[index].name = editName;
          jogadores[index].birthdate = editBirthdate;
          jogadores[index].country = editCountry;
          jogadores[index].height = editHeight;
          jogadores[index].position = editPosition;

          localStorage.setItem('jogadores', JSON.stringify(jogadores));

          mostrarDadosPlayers();
          alert('Jogador atualizado com sucesso!');
        }
      }
    }
  });
};

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
      if(jogador.team != "Sem Equipa"){
        var allTeams = JSON.parse(localStorage.getItem("equipas"))
        var playerTeam = allTeams.find(team => team.name == jogador.team)
        var playerTeamIndex = allTeams.indexOf(playerTeam)
        playerTeam.players.splice(playerTeam.players.findIndex(player => player.id == deleteId), 1)

        allTeams[playerTeamIndex] = playerTeam;

        localStorage.setItem('equipas', JSON.stringify(allTeams));
      }

      jogadores.splice(index, 1);
      localStorage.setItem('jogadores', JSON.stringify(jogadores));
      mostrarDadosPlayers();
      mostrarDadosEquipas();
      alert('Jogador removido com sucesso!');
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

mostrarDadosPlayers();

//Scripts Equipas

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
      const { id, name, acronimo, country, descricao, players } = equipa;

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
        <td>${country}</td>
        <td>${descricao}</td>
        <td>${playerNames}</td>
      `;

      equipasTable.appendChild(row);
    });
  }
};

mostrarDadosEquipas();

const formAdicionarEquipa = document.querySelector('#addTeamForm');

const verificarJogadoresLivres = () => {
  let jogadores = localStorage.getItem('equipas');

  if(jogadores) jogadores = JSON.parse(jogadores)
  else return false;

  if(jogadores.length < 11) return false;


}
//Adicionar equipa
formAdicionarEquipa.addEventListener('submit', (event) => {
  event.preventDefault();


    const equipa = {
      id: criarID("equipas"),
      name: document.querySelector('#addTeamName').value,
      acronimo: document.querySelector('#addTeamAcronimo').value,
      country: document.querySelector('#addTeamCountry').value,
      descricao: document.querySelector('#addTeamDescricao').value,
    };

    console.log(equipa)
    let equipas = localStorage.getItem('equipas');

    if (equipas) {
      equipas = JSON.parse(equipas);
    } else {
      equipas = [];
    }

    equipas.push(equipa);

    localStorage.setItem('equipas', JSON.stringify(equipas));

    mostrarDadosEquipas();
    alert('Equipa adicionado com sucesso!');
});

const guardarInformacoesCampeonato = () => {
  const form = document.querySelector('#addCampeonatoForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const birthdate = document.querySelector('#birthdate').value;

    const birthdateInput = document.querySelector('#birthdate');
    const isidadeValida = validarIdade(birthdateInput);

    if (isidadeValida) {
      const jogador = {
        id: criarID(),
        name,
        birthdate,
        country,
        height,
        position
      };

      let jogadores = localStorage.getItem('jogadores');

      if (jogadores) {
        jogadores = JSON.parse(jogadores);
      } else {
        jogadores = [];
      }

      jogadores.push(jogador);

      localStorage.setItem('jogadores', JSON.stringify(jogadores));

      mostrarDadosPlayers();
      alert('Jogador adicionado com sucesso!');
    }
  });
};
