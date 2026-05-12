function createClientPage() {

  const clientName =
    prompt('Enter Client Name ');

  if (!clientName) return;

  const clientId =
    clientName.toLowerCase().replace(/\s+/g, '-');

  const newClient = {
    id: clientId,
    name: clientName
  };

  clients.push(newClient);

  localStorage.setItem(
    'clients',
    JSON.stringify(clients)
  );

  const clientData = {
    client: clientName,
    credentials: []
  };

  localStorage.setItem(
    clientId,
    JSON.stringify(clientData)
  );

  renderClients(clients);

  loadClientCredentials(clientId);
}
