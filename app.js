let clients = [];
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
  document.getElementById('credentialsSection').classList.remove('hidden');
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
  document.getElementById('credentialsSection').classList.add('hidden');

  document.getElementById('clientList').classList.remove('hidden');
  document.getElementById('searchInput').classList.remove('hidden');
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
