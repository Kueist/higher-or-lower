const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtGenerator = require("./utils/jwtGenerator");
require("dotenv").config()

//middleware
app.use(cors());
app.use(express.json()); //req.body

const authenticate = async(req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json("missing token")
    };

    const token = authToken.split(' ')[1]
    
    try {
        const payload = jwt.verify(token, process.env.jwtSecret);
        
        req.user_id = payload.user_id;
        
        next();
    } catch (err) {
        console.error(err.message)
    }
}

//ROUTES//

//register user
app.post("/api/register", async(req, res) => {
    
    try {
        const {username, password} = req.body;
        // check if already exists
        const checkUser = await pool.query("SELECT * FROM users WHERE username = $1 ", [username] );

        if (checkUser.rows.length !== 0) {
            return res.json("User already exists")
        }
        // encrypt password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const bcryptPassword = await bcrypt.hash(password, salt)
        //insert new user into database
        const newUser = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, bcryptPassword]);
        
        const token = jwtGenerator(newUser.rows[0].user_id)
        
        res.json({token})
    } catch (err) {
        console.error(err.message);
    }
});
//get all users
app.get("/users", async(req,res) => {
    try {
        const getAllUsers = await pool.query("SELECT * FROM users");
        res.json(getAllUsers.rows);
    } catch (err) {
        console.error(err.message);
    }
})
//login
app.post("/api/login", async(req,res) => {
    try {
        const {username, password} = req.body;
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            return res.status(401).json("Username or Password is incorrect")
        };

        const validPassword = await bcrypt.compare(password, user.rows[0].password)

        if (!validPassword) {
            return res.status(401).json("Username or Password is incorrect")
        };

        const token = jwtGenerator(user.rows[0].user_id);

        res.json({token});
    } catch (err) {
        console.error(err);
    }
})
//create stats

//update user stats
app.put("/api/stats", authenticate, async (req, res) => {
    try {
        const {played, won} = req.body;
        const id = req.user_id
        const stats = await pool.query("UPDATE users SET games_played = $1, games_won = $2 WHERE user_id = $3 RETURNING games_played, games_won", [played, won, id])
        res.json(stats.rows[0])
    } catch (err) {
        console.error(err.message)
    }

})

//get user stats
app.get("/api/stats", authenticate, async (req, res) => {
    try {
        const id = req.user_id
        console.log(id)
        const stats = await pool.query("SELECT games_played, games_won FROM users WHERE user_id = $1", [id]);
        res.json(stats.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})


app.listen(5000, () => {
    console.log("server has started on port 5000")
});