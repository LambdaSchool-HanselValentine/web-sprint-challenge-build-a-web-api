// add middlewares here related to projects
const Actions = require("./actions-model");

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

// ActionsId validator:
const validateActionId = async (req, res, next) => {
	const { id } = req.params;
	const action = await Actions.get(id);
	if (!action) {
		res.status(404).json({ message: "action not found" });
	} else {
		req.action = action;
		next();
	}
};

// Actions body validator:
const validateActionBody = async (req, res, next) => {
	const body = req.body;

	if (!body || Object.keys(body).length === 0) {
		res.status(400).json({ message: "missing required text fields" });
	} else if (!body.project_id || typeof body.project_id !== "number") {
		res.status(400).json({ message: "project id must be a number" });
	} else if (!body.description) {
		res.status(400).json({ message: "missing description field" });
	} else if (!body.notes) {
		res.status(400).json({ message: "missing notes field" });
	} else {
		req.body.description = body.notes.trim();
		req.body.notes = body.notes.trim();
		next();
	}
};

module.exports = {
	logger,
	validateActionId,
	validateActionBody,
};
