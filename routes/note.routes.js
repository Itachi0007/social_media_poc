module.exports = (app) => {
	const userController = require("../controllers/userController");
	const postController = require("../controllers/postController");

	// perform user authentication and return a JWT token.
	app.post("/api/authenticate", userController.authenticate);
	// // create a new note
	// app.post("/author/new", notes.author);
	// retrieve all notes
	app.get("/notes", notes.findAll);
	// retrieve single note with authorID
	// app.get("/notes/author/:aid", notes.findNotes);
	// // retrieve note by POST query of title
	// app.post("/notes/search", notes.search);
	// // update note with noteID
	// app.put("/notes/:noteid", notes.update);
	// // delete a note with noteID
	// app.delete("/notes/:noteid", notes.delete);
};
