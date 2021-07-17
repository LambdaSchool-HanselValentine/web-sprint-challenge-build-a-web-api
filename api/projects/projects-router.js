/* eslint-disable no-unused-vars */
// Write your "projects" router here!
const express = require("express");
const Projects = require("./projects-model");
const Middleware = require("./projects-middleware");

const router = express.Router();

// [GET] / api / projects;
// Returns an array of projects as the body of the response. If there are no projects it responds with an empty array.
router.get("/", (req, res) => {
	Projects.get()
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch(() => {
			res.status(500).json({ message: "error fetching projects" });
		});
});

// [GET] /api/projects/:id
// Returns a project with the given id as the body of the response. If there is no project with the given id it responds with a status code 404.
router.get("/:id", Middleware.validateProjectId, (req, res, next) => {
	if (!req.project) {
		next();
	} else {
		res.json(req.project);
	}
});

// [POST] /api/projects
// Returns the newly created project as the body of the response. If the request body is missing any of the required fields it responds with a status code 400.
router.post("/", Middleware.validateProjectBody, (req, res, next) => {
	Projects.insert(req.body)
		.then((newProj) => {
			res.status(201).json(newProj);
		})
		.catch(next);
});

//[PUT] /api/projects/:id
//Returns the updated project as the body of the response. If there is no project with the given id it responds with a status code 404. If the request body is missing any of the required fields it responds with a status code 400.
router.put(
	"/:id",
	Middleware.validateProjectId,
	Middleware.validateProjectBody,
	(req, res, next) => {
		if (!req.project || !req.body) {
			next();
		} else {
			Projects.update(req.params.id, req.body)
				.then((update) => {
					res.status(200).json(update);
				})
				.catch(next);
		}
	},
);

// projects-router error handler:
router.use((err, req, res, next) => {
	const message = err?.message || "Something went wrong in the Projects router";
	const status = err?.status || 500;
	res.status(`${status}`).json({ message, stack: err.stack });
});

module.exports = router;
