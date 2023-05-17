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



// formulario
const allButtons = document.querySelectorAll('.addButtons');
const forms = document.querySelectorAll('.formsPlayers');
const container = document.querySelector('#formContainer');

const openForm = (selectedButton) =>{
  container.style.display = "flex";
  let selectedForm = document.querySelector(`#${selectedButton.id.replace("Player", "")}Form`);
  forms.forEach(form =>{
    form.style.display = "none";
  });
  allButtons.forEach(button =>{
    button.style.display = "none";
  });
  selectedButton.style.display = "block";
  selectedForm.style.display = "flex";
  selectedButton.addEventListener("click", () => closeForm(selectedButton));
}

const closeForm = (selectedButton) =>{
  container.style.display = "none";
  allButtons.forEach(button =>{
    button.style.display = "block";
  });
  selectedButton.addEventListener("click", () => openForm(selectedButton));
}

allButtons.forEach(btn =>{
  btn.addEventListener("click", () => openForm(btn))
}); 

//fim formulario

//Mostra as sections
const toggleSections = () => {
  const sectionTeams = document.querySelector('#sectionTeams');
  const sectionPlayers = document.querySelector('#sectionPlayers');
  const linkJogadores = document.querySelector('.navList li:first-child a');
  const linkEquipas = document.querySelector('.navList li:nth-child(2) a');

  linkJogadores.addEventListener('click', () => {
    sectionTeams.style.display = 'none';
    sectionPlayers.style.display = 'flex';
    sectionPlayers.style.flexDirection = 'column';
  });

  linkEquipas.addEventListener('click', () => {
    sectionPlayers.style.display = 'none';
    sectionTeams.style.display = 'flex';
    sectionTeams.style.flexDirection = 'column';
  });
};

toggleSections();



//Funções para os Jogadores

// Função para criar um ID único para cada jogador
const criarID = () => {
  const jogadores = localStorage.getItem('jogadores');
  if (jogadores) {
    const jogadoresArray = JSON.parse(jogadores);
    const maxId = jogadoresArray.reduce((max, jogador) => {
      return jogador.id > max ? jogador.id : max;
    }, 0);
    return maxId + 1;
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

const guardarInformacoes = () => {
  const form = document.querySelector('#addForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const birthdate = document.querySelector('#birthdate').value;
    const country = document.querySelector('#country').value;
    const height = document.querySelector('#height').value;
    const position = document.querySelector('#position').value;

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

      mostrarDados();
      alert('Jogador adicionado com sucesso!');
    }
  });
};


// Função para editar os dados de um jogador pelo ID
const editarJogador = () => {
  const editForm = document.querySelector('#editForm');

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const editId = document.querySelector('#editId').value;
    const editName = document.querySelector('#editName').value;
    const editBirthdate = document.querySelector('#editBirthdate').value;
    const editCountry = document.querySelector('#editCountry').value;
    const editHeight = document.querySelector('#editHeight').value;
    const editPosition = document.querySelector('#editPosition').value;

    const birthdateInput = document.querySelector('#editBirthdate');
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

          mostrarDados();
          alert('Jogador atualizado com sucesso!');
        }
      }
    }
  });
};

// Função para mostrar os dados dos jogadores na tabela
const mostrarDados = () => {
  const jogadoresTable = document.querySelector('#playersTable');
  jogadoresTable.innerHTML = '';

  let jogadores = localStorage.getItem('jogadores');

  if (jogadores) {
    jogadores = JSON.parse(jogadores);

    jogadores.forEach((jogador) => {
      const { id, name, birthdate, country, height, position } = jogador;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${calcularIdade(birthdate)}</td>
        <td>${country}</td>
        <td>${height}</td>
        <td>${position}</td>
      `;

      jogadoresTable.appendChild(row);
    });
  }
};

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

// Função para remover um jogador pelo ID
const apagarJogador = () => {
  const removeForm = document.querySelector('#removeForm');

  removeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const deleteId = document.querySelector('#deleteId').value;

    let jogadores = localStorage.getItem('jogadores');

    if (jogadores) {
      jogadores = JSON.parse(jogadores);

      const index = jogadores.findIndex((jogador) => jogador.id.toString() === deleteId);

      if (index !== -1) {
        jogadores.splice(index, 1);
        localStorage.setItem('jogadores', JSON.stringify(jogadores));
        mostrarDados();
        alert('Jogador removido com sucesso!');
      } else {
        alert('Jogador não encontrado!');
      }
    } else {
      alert('Jogador não encontrado!');
    }
  });
};


//ativar funções
const ativarFuncoes = () => {
  guardarInformacoes();
  mostrarDados();
  editarJogador();
  apagarJogador();
  
};

ativarFuncoes();


//Fim Jogadores


//Scripts Equipas

//Mostrar formulários


//Fim Equipas