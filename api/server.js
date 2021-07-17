/* eslint-disable no-unused-vars */
const express = require("express");
const server = express();

// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

server.use(express.json());

const helmet = require("helmet");
const morgan = require("morgan");

const projectsRouter = require("./projects/projects-router");
// const actionsRouter = require("./actions/actions-router");

server.use(helmet());
server.use(morgan("dev"));

server.use("/api/projects", projectsRouter);
// server.use("/api/actions", actionsRouter);

// root handler
server.get("/", (req, res) => {
	res.send(`<h2> Welcome to my API Homepage! </h2>`);
});

// catch all
server.use("*", (req, res) => {
	res
		.status(404)
		.send(
			`<h2> oops! that place doesn't exist </h2> <p> read our docs for more info </p>`,
		);
});

// error handler
server.use((err, req, res, next) => {
	const message = err?.message || "something went wrong in the server";
	const status = err?.status || 500;

	res.status(`${status}`).json({ message, stack: err.stack });
});

module.exports = server;
