const jwt = require('jsonwebtoken');
const User = require('../model/user');


const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, "thistokensecretkey");
        const user = await User.findOne({ _id: decoded, "tokens.token": token });
        if (!user) {
            throw new Error();
        }
        //Setting new objects on the req so it can be accessed by the user on other routes.
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send(err)
    }
}

module.exports = auth;