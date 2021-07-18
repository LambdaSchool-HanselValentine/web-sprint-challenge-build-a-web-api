/* eslint-disable no-unused-vars */

const express = require("express");
const Actions = require("./actions-model");
const Middleware = require("./actions-middlware");

const router = express.Router();

// [GET] /api/actions
//Returns an array of actions (or an empty array) as the body of the response.
router.get("/", (req, res, next) => {
	Actions.get()
		.then((actions) => {
			res.status(200).json(actions);
		})
		.catch(next);
});

//[GET] /api/actions/:id
// Returns an action with the given id as the body of the response. If there is no action with the given id it responds with a status code 404.
router.get("/:id", Middleware.validateActionId, (req, res, next) => {
	if (!req.action) {
		next();
	} else {
		res.status(200).json(req.action);
	}
});

// [POST] /api/actions
// Returns the newly created action as the body of the response. If the request body is missing any of the required fields it responds with a status code 400. When adding an action make sure the project_id provided belongs to an existing project.
router.post("/", Middleware.validateActionBody, (req, res, next) => {
	Actions.insert(req.body)
		.then((newAction) => {
			res.status(201).json(newAction);
		})
		.catch(next);
});

// [PUT] /api/actions/:id
//Returns the updated action as the body of the response.If there is no action with the given id it responds with a status code 404. If the request body is missing any of the required fields it responds with a status code 400.
router.put(
	"/:id",
	Middleware.validateActionId,
	Middleware.validateActionBody,
	(req, res, next) => {
		const { id } = req.params;

		if (!req.action || !req.body) {
			next();
		} else {
			Actions.update(id, req.body)
				.then((update) => {
					res.status(200).json(update);
				})
				.catch(next);
		}
	},
);

// [DELETE] /api/actions/:id
// Returns no response body. If there is no action with the given id it responds with a status code 404.
router.delete("/:id", Middleware.validateActionId, (req, res, next) => {
	const { id } = req.params;

	if (!req.action) {
		next();
	} else {
		Actions.remove(id)
			.then(() => {
				res.status(200).json({
					message: `Action successfully deleted`,
				});
			})
			.catch(next);
	}
});

// actions-router error handler:
router.use((err, req, res, next) => {
	const message = err?.message || "Something went wrong in the Actions router";
	const status = err?.status || 500;
	res.status(`${status}`).json({ message, stack: err.stack });
});

module.exports = router;
