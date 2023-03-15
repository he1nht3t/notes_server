const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const Note = require("./models/note");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

let notes = [];

app.get("/api/notes", (req, res) => {
	Note.find({}).then(notes => {
		res.json(notes);
	});
});

app.post("/api/notes", (req, res, next) => {
	const body = req.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	});

	note.save()
		.then(savedNote => {
			res.json(savedNote);
		})
		.catch(error => next(error));
});

app.get("/api/notes/:id", (req, res, next) => {
	const id = req.params.id;

	Note.findById(id)
		.then(note => {
			if (note) {
				res.json(note);
			} else {
				res.status(404).end();
			}
		})
		.catch(error => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
	const id = req.params.id;

	Note.findByIdAndRemove(id)
		.then(result => {
			if (result) {
				return res.status(204).end();
			} else {
				return res.status(404).end();
			}
		})
		.catch(error => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
	const id = req.params.id;
	const { content, important } = req.body;

	Note.findByIdAndUpdate(
		id,
		{ content, important },
		{ new: true, runValidators: true, context: "query" }
	)
		.then(updatedNote => {
			res.json(updatedNote);
		})
		.catch(error => next(error));
});

//unknown endpoint handler
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

//error handler
const errorHandler = (error, req, res, next) => {
	console.log(error.message);

	if (error.name === "CastError") {
		return res.status(400).send({ error: "malformatted id" });
	}

	if (error.name === "ValidationError") {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
