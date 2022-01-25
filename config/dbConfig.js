const Pool = require("pg").Pool;
const pgtools = require("pgtools");

const config = {
	user: "postgres",
	password: "Ahmer@13",
	host: "localhost",
	port: 5432,
};

pgtools.createdb(config, "notes-db", function (err, res) {
	if (err) {
		console.error(err);
		process.exit(-1);
	}
	console.log(res);

	// pgtools.dropdb(config, "notes-db", function (err, res) {
	// 	if (err) {
	// 		console.error(err);
	// 		process.exit(-1);
	// 	}
	// 	console.log(res);
	// });
});

const pool = new Pool({
	user: "postgres",
	password: "Ahmer@13",
	host: "localhost",
	port: 5432,
	database: "notes-db",
});

module.exports = {
	pool: pool,
};
