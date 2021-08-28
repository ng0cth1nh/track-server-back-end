require("./models/User");
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');

dotenv.config();
const app = express();
app.use(express.json());

const mongoUri = process.env.DB_HOST;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
    console.log("connected db");
});

mongoose.connection.error("error", () => {
    console.log("error to connect");
});

app.use(authRoutes);


app.get('/', requireAuth, (req, res) => {
    res.send(`your email is ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('listening on 3000');
});