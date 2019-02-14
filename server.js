const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");

const usersRouter = require("./data/users/router");
const postsRouter = require("./data/posts/router");

const server = express();

server.use(logger('dev'), helmet(), express.json());


server.use("/api/users", usersRouter);
server.use("/api/posts", postsRouter);

module.exports = server;