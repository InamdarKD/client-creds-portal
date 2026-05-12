let clients = [];

/* --------------------------
   LOAD INITIAL CLIENTS
---------------------------*/

async function loadClients() {

  try {

    const response = await fetch('./data/clients.json');

    clients = await response.json();

    /* Load locally added clients */
    const localClients =
      JSON.parse(localStorage.getItem('clients')) || [];

    clients = [...clients, ...localClients];

    renderClients(clients);

  } catch (error) {

    console.error('Error loading clients:', error);

  }
}

/* --------------------------
   RENDER CLIENT LIST
---------------------------*/

function renderClients(clientList) {

  const container =
    document.getElementById('clientList');

  container.innerHTML = '';

  clientList.forEach(client => {

    const card = document.createElement('div');

    card.className = 'client-card';

    card.innerHTML = `
      <h3>${client.name}</h3>
    `;

    card.onclick = () =>
      loadClientCredentials(client.id);

    container.appendChild(card);
  });
}

/* --------------------------
   LOAD CLIENT CREDENTIALS
---------------------------*/

async function loadClientCredentials(clientId) {

  let data = null;

  try {

    const response =
      await fetch(`./data/${clientId}.json`);

    data = await response.json();

  } catch {

    /* Local client fallback */

    const localData =
      JSON.parse(localStorage.getItem(clientId));

    data = localData;
  }

  if (!data) return;

  document.getElementById('clientTitle').innerText =
    data.client;

  const table =
    document.getElementById('credentialsTable');

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
        <span id="pwd-${index}">
          ••••••••
        </span>

        <button
          class="show-btn"
          onclick="togglePassword(${index}, '${cred.password}')"
        >
          Show
        </button>

        <button
          class="copy-btn"
          onclick='copyCredential(${JSON.stringify(cred)})'
        >
          Copy
        </button>
      </td>
    `;

    table.appendChild(row);
  });

  /* Save selected client globally */

  window.currentClientId = clientId;

  document
    .getElementById('clientList')
    .classList.add('hidden');

  document
    .getElementById('searchInput')
    .classList.add('hidden');

  document
    .getElementById('credentialsSection')
    .classList.remove('hidden');
}

/* --------------------------
   SHOW / HIDE PASSWORD
---------------------------*/

function togglePassword(index, password) {

  const element =
    document.getElementById(`pwd-${index}`);

  if (element.innerText === '••••••••') {

    element.innerText = password;

  } else {

    element.innerText = '••••••••';
  }
}

/* --------------------------
   COPY FULL PAYLOAD
---------------------------*/

function copyCredential(cred) {

  const payload =
`System: ${cred.system}
URL: ${cred.url}
Username: ${cred.username}
Password: ${cred.password}`;

  navigator.clipboard.writeText(payload);

  alert('Credential copied');
}

/* --------------------------
   BACK BUTTON
---------------------------*/

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

/* --------------------------
   SEARCH CLIENTS
---------------------------*/

document
  .getElementById('searchInput')
  .addEventListener('keyup', function () {

    const value =
      this.value.toLowerCase();

    const filtered =
      clients.filter(client =>
        client.name.toLowerCase().includes(value)
      );

    renderClients(filtered);
  });

/* --------------------------
   ADD NEW CLIENT
---------------------------*/

function addNewClient() {

  const clientName =
    prompt('Enter Client Name');

  if (!clientName) return;

  const clientId =
    clientName.toLowerCase().replace(/\s+/g, '-');

  const newClient = {
    id: clientId,
    name: clientName
  };

  clients.push(newClient);

  /* Save client list */

  localStorage.setItem(
    'clients',
    JSON.stringify(
      clients.filter(c =>
        !['primus'].includes(c.id)
      )
    )
  );

  /* Create empty credential structure */

  const clientData = {
    client: clientName,
    credentials: []
  };

  localStorage.setItem(
    clientId,
    JSON.stringify(clientData)
  );

  renderClients(clients);

  alert('Client Added');
}

/* --------------------------
   ADD NEW CREDENTIAL
---------------------------*/

function addCredential() {

  const system =
    prompt('System Name');

  const url =
    prompt('URL');

  const username =
    prompt('Username');

  const password =
    prompt('Password');

  const clientId =
    window.currentClientId;

  const clientData =
    JSON.parse(localStorage.getItem(clientId));

  clientData.credentials.push({
    system,
    url,
    username,
    password
  });

  localStorage.setItem(
    clientId,
    JSON.stringify(clientData)
  );

  loadClientCredentials(clientId);

  alert('Credential Added');
}

/* --------------------------
   INITIAL LOAD
---------------------------*/

loadClients();
