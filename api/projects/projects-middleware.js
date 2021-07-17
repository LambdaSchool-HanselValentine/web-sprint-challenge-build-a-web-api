// add middlewares here related to projects
const Projects = require("./projects-model");

//logger middleware (not used because Im using morgan but keeping it for future references)
const logger = (req, res, next) => {
	const method = req.method;
	const url = req.url;
	const timeStamp = new Date().toLocaleDateString("en-US");

	console.log(`
  ${timeStamp} || ${method} request to ${url}
  `);
	next();
};

// ProjectId validator:
const validateProjectId = async (req, res, next) => {
	const { id } = req.params;

	const project = await Projects.get(id);
	if (!project) {
		res.status(404).json({ message: "project not found" });
	} else {
		req.project = project;
		next();
	}
};

// Project body validator:
const validateProjectBody = async (req, res, next) => {
	const body = req.body;

	if (!body || Object.keys(body).length === 0) {
		res.status(400).json({ message: "missing name and description" });
	} else if (!body.name) {
		res.status(400).json({ message: "missing name field" });
	} else if (!body.description) {
		res.status(400).json({ message: "missing description field" });
	} else if (!body.completed || typeof body.completed !== "boolean") {
		// for the boolean on [PUT] update request
		res.status(400).json({ message: "completed must be a boolean" });
	} else {
		req.body.name = body.name.trim();
		req.body.description = body.description.trim();
		next();
	}
};

module.exports = {
	logger,
	validateProjectId,
	validateProjectBody,
};
