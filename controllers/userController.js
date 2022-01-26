const {response} = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let sprintf = require("sprintf-js").sprintf;
const db = require("../config/dbConfig").pool;

exports.authenticate = async (req, res) => {
	// validate request
	var email = req.body.email;
	var password = req.body.password;
	const user = await (
		await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password])
	).rows;
	if (user.length == 0) {
		var message = "Invalid credentials";
		return res.send(message);
	}
	// return a JWT
	const payload = {
		id: user[0].id,
		email: email,
		followers: user[0].followers,
		following: user[0].following,
	};
	// generating access token
	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: "300s"});
	return res.send(accessToken);
};

exports.follow = async (req, res) => {
	// validate request
	var followerId = req.user.id;
	var newFollowingCount = req.user.following + 1;
	var followingId = req.params.uid;
	const userToBeFollowed = await (await db.query("SELECT * FROM users WHERE id = $1", [followingId])).rows;
	console.log(followingId);
	if (userToBeFollowed.length == 0) {
		var message = "User not found";
		return res.send(message);
	}
	var newFollowerCount = userToBeFollowed[0].followers + 1;
	await db.query("UPDATE users SET followers = $1 WHERE id = $2", [newFollowerCount, followingId]);
	await db.query("UPDATE users SET following = $1 WHERE id = $2", [newFollowingCount, followerId]);
	return res.send("Follow successful");
};

exports.unfollow = async (req, res) => {
	// validate request
	var unfollowerId = req.user.id;
	var newFollowingCount = Math.max(0, req.user.following - 1);
	var followingId = req.params.uid;
	const userToBeUnfollowed = await (await db.query("SELECT * FROM users WHERE id = $1", [followingId])).rows;
	console.log(followingId);
	if (userToBeUnfollowed.length == 0) {
		var message = "User not found";
		return res.send(message);
	}
	var newFollowerCount = Math.max(0, userToBeUnfollowed[0].followers - 1);
	await db.query("UPDATE users SET followers = $1 WHERE id = $2", [newFollowerCount, followingId]);
	await db.query("UPDATE users SET following = $1 WHERE id = $2", [newFollowingCount, unfollowerId]);
	return res.send("Unfollow successful");
};

exports.getUser = async (req, res) => {
	// validate request
	var userId = req.user.id;
	const user = await (await db.query("SELECT * FROM users WHERE id = $1", [userId])).rows;
	if (user.length == 0) {
		var message = "User not found";
		return res.send(message);
	}
	delete user[0].password;
	return res.send(user[0]);
};

exports.getAllUsers = async (req, res) => {
	// validate request
	const user = await (await db.query("SELECT * FROM users")).rows;
	if (user.length == 0) {
		var message = "No users found";
		return res.send(message);
	}
	return res.send(user[0]);
};
