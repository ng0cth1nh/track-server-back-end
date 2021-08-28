const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: "Invalid authorization" });
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, "secretKey", async (error, payload) => {
        if (error) {
            return res.status(401).send({ error: "Invalid authorization" });
        }
        const { userId } = payload;
        const user = await User.findById(userId);
        req.user = user;
        next();
    });
}