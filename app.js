let clients = [];

/* =========================
   LOAD CLIENTS
========================= */

async function loadClients() {

  try {

    const response =
      await fetch('./data/clients.json');

    clients =
      await response.json();

    console.log(
      'Clients Loaded:',
      clients
    );

    renderClients(clients);

  } catch (error) {

    console.error(
      'Error loading clients:',
      error
    );
  }
}

/* =========================
   RENDER CLIENT LIST
========================= */

function renderClients(clientList) {

  const container =
    document.getElementById('clientList');

  container.innerHTML = '';

  if (clientList.length === 0) {

    container.innerHTML = `
      <div class="client-card">
        No Clients Found
      </div>
    `;

    return;
  }

  clientList.forEach(client => {

    const card =
      document.createElement('div');

    card.className = 'client-card';

    card.innerHTML = `

      <h3>
        ${client.filter || client.name}
      </h3>

      <p>
        ${client.name || ''}
      </p>

    `;

    card.addEventListener('click', () => {

      loadClientCredentials(client.id);
    });

    container.appendChild(card);
  });
}

/* =========================
   LOAD CLIENT CREDENTIALS
========================= */

async function loadClientCredentials(clientId) {

  try {

    const response =
      await fetch(`./data/${clientId}.json`);

    if (!response.ok) {

      throw new Error(
        `File not found: ${clientId}.json`
      );
    }

    const data =
      await response.json();

    console.log(
      'Client Data:',
      data
    );

    /* SAFE DEFAULTS */

    const credentials =
      data.credentials || [];

    const communicationIds =
      data.communicationIds || [];

    /* STORE GLOBALS */

    window.currentCredentials =
      credentials;

    window.currentCommCredentials =
      communicationIds;

    /* TITLE */

    document.getElementById(
      'clientTitle'
    ).innerText =
      data.client || clientId;

    /* =========================
       USER CREDENTIALS TABLE
    ========================== */

    const table =
      document.getElementById(
        'credentialsTable'
      );

    table.innerHTML = '';

    if (credentials.length > 0) {

      credentials.forEach(
        (cred, index) => {

          const row =
            document.createElement('tr');

          row.innerHTML = `

            <td>${cred.system || ''}</td>

            <td>
              <a
                href="${cred.url || '#'}"
                target="_blank"
              >
                ${cred.url || ''}
              </a>
            </td>

            <td>${cred.username || ''}</td>

            <td>

              <span id="pwd-${index}">
                ••••••••
              </span>

              <button
                class="show-btn"
                onclick="togglePassword(
                  ${index},
                  '${cred.password || ''}'
                )"
              >
                Show
              </button>

              <button
                class="copy-btn"
                onclick="copyCredentialByIndex(${index})"
              >
                Copy
              </button>

            </td>
          `;

          table.appendChild(row);
        }
      );

    } else {

      table.innerHTML = `
        <tr>
          <td colspan="4">
            No User Credentials Available
          </td>
        </tr>
      `;
    }

    /* =========================
       COMMUNICATION IDS TABLE
    ========================== */

    const commTable =
      document.getElementById(
        'communicationTable'
      );

    commTable.innerHTML = '';

    if (
      communicationIds.length > 0
    ) {

      communicationIds.forEach(
        (cred, index) => {

          const row =
            document.createElement('tr');

          row.innerHTML = `

            <td>${cred.system || ''}</td>

            <td>
              <a
                href="${cred.url || '#'}"
                target="_blank"
              >
                ${cred.url || ''}
              </a>
            </td>

            <td>${cred.username || ''}</td>

            <td>

              <span id="comm-pwd-${index}">
                ••••••••
              </span>

              <button
                class="show-btn"
                onclick="toggleCommPassword(
                  ${index},
                  '${cred.password || ''}'
                )"
              >
                Show
              </button>

              <button
                class="copy-btn"
                onclick="copyCommCredentialByIndex(${index})"
              >
                Copy
              </button>

            </td>
          `;

          commTable.appendChild(row);
        }
      );

    } else {

      commTable.innerHTML = `
        <tr>
          <td colspan="4">
            No Communication IDs Available
          </td>
        </tr>
      `;
    }

    /* PAGE SWITCH */

    document
      .getElementById('homePage')
      .classList.add('hidden');

    document
      .getElementById('credentialsSection')
      .classList.remove('hidden');

  } catch (error) {

    console.error(
      'Error loading credentials:',
      error
    );

    alert(
      'Unable to load client credentials'
    );
  }
}

/* =========================
   SHOW PASSWORD
========================= */

function togglePassword(index, password) {

  const element =
    document.getElementById(
      `pwd-${index}`
    );

  if (
    element.innerText === '••••••••'
  ) {

    element.innerText = password;

  } else {

    element.innerText = '••••••••';
  }
}

/* =========================
   COPY USER CREDS
========================= */

function copyCredentialByIndex(index) {

  const cred =
    window.currentCredentials[index];

  const payload =
`System: ${cred.system}
URL: ${cred.url}
Username: ${cred.username}
Password: ${cred.password}`;

  navigator.clipboard.writeText(payload);

  alert('Credential copied');
}

/* =========================
   SHOW COMM PASSWORD
========================= */

function toggleCommPassword(index, password) {

  const element =
    document.getElementById(
      `comm-pwd-${index}`
    );

  if (
    element.innerText === '••••••••'
  ) {

    element.innerText = password;

  } else {

    element.innerText = '••••••••';
  }
}

/* =========================
   COPY COMM CREDS
========================= */

function copyCommCredentialByIndex(index) {

  const cred =
    window.currentCommCredentials[index];

  const payload =
`System: ${cred.system}
URL: ${cred.url}
Communication User: ${cred.username}
Password: ${cred.password}`;

  navigator.clipboard.writeText(payload);

  alert(
    'Communication credential copied'
  );
}

/* =========================
   BACK BUTTON
========================= */

function goBack() {

  document
    .getElementById('credentialsSection')
    .classList.add('hidden');

  document
    .getElementById('homePage')
    .classList.remove('hidden');
}

/* =========================
   SEARCH CLIENTS
========================= */

document
  .getElementById('searchInput')
  .addEventListener(
    'keyup',
    function () {

      const value =
        this.value
          .toLowerCase()
          .trim();

      const filtered =
        clients.filter(client => {

          const name =
            (client.name || '')
              .toLowerCase();

          const filter =
            (client.filter || '')
              .toLowerCase();

          return (
            name.includes(value) ||
            filter.includes(value)
          );
        });

      renderClients(filtered);
    }
  );

/* =========================
   INITIAL LOAD
========================= */

loadClients();
