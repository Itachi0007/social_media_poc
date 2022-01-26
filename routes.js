const jwt = require("jsonwebtoken");

module.exports = (app) => {
	const userController = require("./controllers/userController");
	const postController = require("./controllers/postController");

	// perform user authentication and return a JWT token.
	app.post("/api/authenticate", userController.authenticate);
	app.post("/api/follow/:uid", authenticateToken, userController.follow);
	app.post("/api/unfollow/:uid", authenticateToken, userController.unfollow);
	app.get("/api/user", authenticateToken, userController.getUser);
	app.get("/api/user/all", userController.getAllUsers);
};

function authenticateToken(req, res, next) {
	// authenticate the user's token
	const authHeader = req.headers["authorization"]; // getting the auth data from header
	const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
	if (!token) {
		return res.status(401).json("PLEASE PASS A TOKEN");
	}
	jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
		if (err) {
			return res.status(403).json("Invalid token passed");
		}
		console.log("Token Authenticated on server");
		req.user = payload;
		next();
	});
}
