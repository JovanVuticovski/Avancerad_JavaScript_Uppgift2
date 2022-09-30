const net = require("net");

// Array list with clients
const connectedClients = [];

const server = net.createServer();

server.on("connection", (client) => {
  connectedClients.push(client);

  client.on("error", (err) => {
    console.error(err);
  });

  //BroadCast message to all clients in array connectedClients
  client.on("data", (data) => {
    broadcast(data, client);
    console.log(data.toString());
  });

  server.on("error", (err) => {
    console.error(err);
  });
});

server.on("close", (client) => {
  console.log("client have disconnected");
  client.write("You have been disconnected from the server");
});

server.on("error", (err) => {
  console.error(err);
});

server.listen({
  host: "localhost",
  port: 8081,
});

function broadcast(message, clientSent) {
  if (message === "quit") {
    const index = connectedClients.indexOf(clientSent);
    connectedClients.splice(index, 1);
  } else {
    connectedClients.forEach((client) => {
      if (client !== clientSent) client.write(message);
    });
  }

  server.on("error", (err) => {
    console.error(err);
  });
}
