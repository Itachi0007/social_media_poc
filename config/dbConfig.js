const Pool = require("pg").Pool;
const pgtools = require("pgtools");
const {Client} = require("pg");

const config = {
	user: "postgres",
	password: "Ahmer@13",
	host: "localhost",
	port: 5432,
};

const createUsersTable = `CREATE TABLE IF NOT EXISTS "users" (
	    ID  SERIAL PRIMARY KEY,
    	email character varying NOT NULL,
    	password character varying NOT NULL,
    	followers integer,
    	following integer,
		UNIQUE(email) )`;
const createUser1 =
	"INSERT INTO users(email, password, followers, following) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING";
const createUser2 =
	"INSERT INTO users(email, password, followers, following) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING";

const pool = new Pool({
	user: config.user,
	password: config.password,
	host: config.host,
	port: config.port,
	database: "notes-db",
});

pool.query(createUsersTable, (err, res) => {
	console.log(err, res);
	pool.query(createUser1, ["ahmer@123.com", "abcd", 0, 0], (err, res) => {
		console.log(err, res);
	});
	pool.query(createUser2, ["mallu@234.com", "1234", 0, 0], (err, res) => {
		console.log(err, res);
	});
});

module.exports = {
	pool: pool,
};
