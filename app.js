let clients = [];

async function loadClients() {

  try {

    const response = await fetch('./data/clients.json');

    clients = await response.json();

    console.log(clients);

    renderClients(clients);

  } catch (error) {

    console.error('Error loading clients:', error);

  }
}

function renderClients(clientList) {

  const container = document.getElementById('clientList');

  container.innerHTML = '';

  clientList.forEach(client => {

    const card = document.createElement('div');

    card.className = 'client-card';

    card.innerHTML = `
      <h3>${client.name}</h3>
    `;

    card.onclick = () => loadClientCredentials(client.id);

    container.appendChild(card);
  });
}

async function loadClientCredentials(clientId) {

  try {

    const response = await fetch(`./data/${clientId}.json`);

    const data = await response.json();

    document.getElementById('clientTitle').innerText = data.client;

    const table = document.getElementById('credentialsTable');

    table.innerHTML = '';

    data.credentials.forEach((cred, index) => {

      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${cred.system}</td>

        <td>
          <a href="${cred.url}" target="_blank">
            Open Link
          </a>
        </td>

        <td>${cred.username}</td>

        <td>
          <span id="pwd-${index}">••••••••</span>

          <button
            class="show-btn"
            onclick="togglePassword(${index}, '${cred.password}')"
          >
            Show
          </button>

          <button
            class="copy-btn"
            onclick="copyPassword('${cred.password}')"
          >
            Copy
          </button>
        </td>
      `;

      table.appendChild(row);

    });

    document.getElementById('clientList').classList.add('hidden');

    document.getElementById('searchInput').classList.add('hidden');

    document
      .getElementById('credentialsSection')
      .classList.remove('hidden');

  } catch (error) {

    console.error('Error loading credentials:', error);

  }
}

function togglePassword(index, password) {

  const element = document.getElementById(`pwd-${index}`);

  if (element.innerText === '••••••••') {

    element.innerText = password;

  } else {

    element.innerText = '••••••••';

  }
}

function copyPassword(password) {

  navigator.clipboard.writeText(password);

  alert('Password copied');
}

function goBack() {

  document
    .getElementById('credentialsSection')
    .classList.add('hidden');

  document
    .getElementById('clientList')
    .classList.remove('hidden');

  document
    .getElementById('searchInput')
    .classList.remove('hidden');
}

document
  .getElementById('searchInput')
  .addEventListener('keyup', function () {

    const value = this.value.toLowerCase();

    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(value)
    );

    renderClients(filtered);
  });

loadClients();
