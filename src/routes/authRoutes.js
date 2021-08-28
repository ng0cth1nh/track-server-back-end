const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = mongoose.model("User");
dotenv.config();

const authRoutes = express.Router();

authRoutes.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        res.send({ token });
    } catch (error) {
        res.status(422).send(error.message);
    }

});

authRoutes.post("/signin", async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(401).send("Must provide email and password");
    }
    const user = await User.findOne({ email });
    if(!user) return res.status(401).send({error: "Invalid email"});
    try {
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY);
        res.send({ token });
    } catch (error) {
        return res.status(401).send({error: "Invalid password"});
    }
    
})
module.exports = authRoutes;