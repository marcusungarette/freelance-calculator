const express = require('express');
const server = express();
const routes = require('./routes');

const port = 3535;

server.set('view engine', 'ejs');

server.use(express.urlencoded({ extended: true }));

server.use(express.static('public'));

server.use(routes);

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
