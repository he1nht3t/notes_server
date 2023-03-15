const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const Note = require("./models/note");

//unknown endpoint handler
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

//error handler
const errorHandler = (error, req, res, next) => {
	console.log(error.message);

	if (error.name === "CastError") {
		return res.status(400).send({ error: "malformatted id" });
	}

	next(error);
};

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

let notes = [];

app.get("/api/notes", (req, res) => {
	Note.find({}).then(notes => {
		res.json(notes);
	});
});

app.post("/api/notes", (req, res) => {
	const body = req.body;

	if (body.content === undefined) {
		return res.status(400).json({ error: "content missing" });
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	});

	note.save().then(savedNote => {
		res.json(savedNote);
	});
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
			res.status(204).end();
		})
		.catch(error => next(error));

	res.status(204).end();
});

app.put("/api/notes/:id", (req, res, next) => {
	const id = req.params.id;
	const body = req.body;

	const note = {
		content: body.content,
		important: body.important,
	};

	Note.findByIdAndUpdate(id, note, { new: true })
		.then(updatedNote => {
			res.json(updatedNote);
		})
		.catch(error => next(error));
});

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
