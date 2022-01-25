const {response} = require("express");
let sprintf = require("sprintf-js").sprintf;
const db = require("../config/dbConfig").pool;

// create and save new note
exports.create = async function (req, res) {
	// validate req
	var reqBodyValidate = validate.body(req);
	if (reqBodyValidate == false) {
		return res.status(400).send({message: "Note/Author cannot be empty!"});
	}

	// validate authorID
	const authorID = req.body.author._id;
	const authorData = await dbCon.query("SELECT * FROM `notes-app`.author WHERE idAuthor = " + authorID);
	if (authorData.length == 0) {
		return res.status(400).send({message: "Invalid AuthorID"});
	}
	// create Note
	const noteData = {
		title: req.body.note.title,
		content: req.body.note.content,
		authorId: req.body.author._id,
	};
	const qry = sprintf(
		"INSERT INTO `notes-app`.`notes`(`title`, `content`, `authorId`) VALUES('%s', '%s', '%s')",
		noteData.title,
		noteData.content,
		noteData.authorId
	);
	const result = await dbCon.query(qry);
	// send email to all the authors
	var maillist = await dbCon.query("SELECT email FROM `notes-app`.author");
	sendMail(maillist);
	return res.send({message: "Note created successfully with ID = " + result.insertId});
};

exports.authenticate = async (req, res) => {
	// create Author
	var authorData = req.body.author;
	const author = {
		name: authorData.name,
		email: authorData.email,
	};
	const qry = sprintf(
		"INSERT INTO `notes-app`.`author`(`name`, `email`) VALUES('%s', '%s')",
		author.name,
		author.email
	);
	const result = await dbCon.query(qry);
	var dict = {
		message: "Success",
		method: req.method,
		detail: "http://localhost:3000" + req.url,
		data: "Author created with ID = " + result.insertId,
	};
	return res.send(dict);
};

// retrieve and show all notes
exports.findAll = async (req, res) => {
	var result = await db.query("SELECT * FROM todo");
	var dict = {
		message: "Success",
		method: req.method,
		endpoint: req.url,
		data: result,
	};
	return res.send(dict);
};

// find notes with authorID
exports.findNotes = async (req, res) => {
	const authorID = req.params.aid;
	// validate authorID
	const authorData = await dbCon.query("SELECT * FROM `notes-app`.author WHERE idAuthor = " + authorID);
	if (authorData.length == 0) {
		return res.status(400).send({message: "Invalid AuthorID"});
	}

	var notes = await dbCon.query("SELECT * FROM `notes-app`.notes WHERE author = " + authorID);
	if (notes.length == 0) {
		var dict = {
			message: "Note not found with given Author",
			method: req.method,
			details: "http://localhost:3000" + req.url,
			data: notes,
		};
		return res.send(dict);
	}
	var dict = {
		message: "Success",
		method: req.method,
		details: "http://localhost:3000" + req.url,
		data: notes,
	};
	return res.send(dict);
};

// update a note by noteID
exports.update = async (req, res) => {
	// Validate Request
	if (!req.body.content || !req.body.title) {
		return res.status(400).send({message: "Note content OR title can not be empty"});
	}
	const noteID = req.params.nid;
	const qry = "SELECT * FROM `notes-app`.notes WHERE idnotes = " + noteID;
	const noteData = await dbCon.query(qry);
	if (noteData.length == 0) {
		return res.status(404).send({message: "Note not found with ID " + noteID});
	}
	// updating the note
	const note = {
		title: req.body.title,
		content: req.body.content,
	};
	const query = sprintf(
		"UPDATE `notes-app`.`notes` SET `content` = '%s', `title` = '%s' WHERE (`idnotes` = '%s');",
		note.title,
		note.content,
		noteID
	);
	var result = dbCon.query(query);
	return res.status(200).send({message: "Note updated successfully with ID " + noteID});
};

// delete a note by noteID
exports.delete = async (req, res) => {
	// validate note ID
	const noteID = req.params.nid;
	const qry = "SELECT * FROM `notes-app`.notes WHERE idnotes = " + noteID;
	const noteData = await dbCon.query(qry);
	if (noteData.length == 0) {
		return res.status(404).send({message: "Note not found with ID " + noteID});
	}
	const query = sprintf("DELETE FROM`notes-app`.`notes` WHERE(`idnotes` = '%s')", noteID);
	var result = dbCon.query(query);
	return res.status(200).send({message: "Note deleted successfully with ID " + noteID});
};
