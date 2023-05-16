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


//Adicionar jogadores à tabela
const tableBody = document.querySelector("#playersTable");
const inputs = document.querySelector("input");

//Ajax Para cria a tabela de jogadores
fetch('/jogadores')
  .then(response => response.json())
  .then(players => {
    players.forEach(player => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = player.name;
      row.appendChild(nameCell);

      const birthdateCell = document.createElement('td');
      birthdateCell.textContent = player.age;
      row.appendChild(birthdateCell);

      const countryCell = document.createElement('td');
      countryCell.textContent = player.country;
      row.appendChild(countryCell);

      const heightCell = document.createElement('td');
      heightCell.textContent = player.height + " cm";
      row.appendChild(heightCell);

      const positionCell = document.createElement('td');
      positionCell.textContent = player.position;
      row.appendChild(positionCell);

      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error(error));



  function verifyRemoveForm() {
    const form = document.querySelector('#removeForm');
    const playerIdInput = document.querySelector('#deleteId');
    const submitButton = document.querySelector('#removeForm input[type="submit"]');
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const playerId = playerIdInput.value;
  
      if (playerId > 0) {
        // ID válido, enviar o formulário
        form.submit();
      } else {
        // ID inválido, exibir uma mensagem de erro ou realizar outra ação
        alert('ID inválido');
      }
    });
  }
  
  //Chama a função de verificação do formulário de remoção
  verifyRemoveForm();
  
  function verifyAddForm() {
    const form = document.querySelector('#addForm');
    const nameInput = document.querySelector('#name');
    const countryInput = document.querySelector('#country');
    const birthdateInput = document.querySelector('#birthdate');
    const heightInput = document.querySelector('#height');
    const submitButton = document.querySelector('#addForm input[type="submit"]');
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      //Verifica se o nome contém apenas letras
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(nameInput.value)) {
        alert('O nome deve conter apenas letras');
        return;
      }
  
      //Verifica se o país contém apenas letras
      if (!nameRegex.test(countryInput.value)) {
        alert('O país deve conter apenas letras');
        return;
      }
  
      //o ano de nascimento do jogador
      const birthdateYear = new Date(birthdateInput.value).getFullYear();
  
      // Verificar se o ano de nascimento é inferior a 1960
      if (birthdateYear < 1960) {
        alert('O jogador deve ter nascido após 1960');
        return;
        // 
      }
  
      //altura do jogador
      const height = parseInt(heightInput.value);
  
      //Verifica se a altura está dentro da faixa válida (150-210)
      if (height < 150 || height > 210) {
        alert('A altura do jogador deve estar entre 150 e 210');
        return;
      }
  
      // O nome, país, ano de nascimento e altura estão válidos, enviar o formulário
      form.submit();
    });
  }
  
  // Chamar a função para configurar o formulário de adição
  verifyAddForm();
  