const net = require("net");

const readLine = require("readline");

let rl = readLine.createInterface(process.stdin, process.stdout);

let portChecker;

// Check if entered host is correct
const clientNameInput = new Promise((resolve) => {
  rl.question("Enter username: ", (clientUser) => {
    rl.question("Enter server port (8081): ", (port) => {
      portChecker = port;

      resolve(clientUser);
    });
  });
});

clientNameInput.then((clientUser) => {
  const client = net.createConnection({
    host: "localhost",

    port: `${portChecker}`,
  });

  client.on("error", function (err) {
    console.error("You entered wrong port");
    process.exit();
  });

  // Notify server and other clients that client have joined
  client.on("connect", () => {
    client.write(`${clientUser} has entered the chat.`);
    console.log(`Your server is running on localhost:${portChecker}`);
  });

  // Get messages from clients
  client.on("data", (data) => {
    console.log("User:", data.toString());
  });

  // Sending message/ quitting chat
  rl.on("line", (data) => {
    if (data === "quit") {
      client.write(`${clientUser}: have choosen to leave the chat`);
      // Timeout 2 seconds to allow message to display
      client.setTimeout(2000);
    } else {
      client.write(clientUser + ": " + data);
    }
  });

  // On user input  "end" end connection
  client.on("timeout", () => {
    client.end();

    // close connection
    client.on("end", () => {
      process.exit();
    });
  });
});
