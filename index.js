// code away!
//https://github.com/JamieHall1962/Node-Blog/pull/1


const server = require('./server');

const port = 4000;
server.listen(port, () =>
  console.log(`\n=== Server listening on Port: ${port} ===\n`)
);

