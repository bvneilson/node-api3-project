const express = require('express');
const postRoutes = require('./posts/postRouter.js');
const userRoutes = require('./users/userRouter.js');

function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`${now}: ${req.method} to ${req.url} from ${req.get('Origin')}`);

  next();
}

const port = 4000;
const server = express();

server.use(express.json());
server.use(logger);


server.use('/posts', postRoutes);
server.use('/users', userRoutes);

server.use(function(req, res, next) {
  res.status(404).send("That request cannot be processed");
});

server.listen(port, () => console.log("Listening for changes on port " + port));
