const jwt = require('jsonwebtoken');

exports.createToken = (body) => {

    let token = null;
    const lifeTime = 3600 * 24 * 1000;

    try {

        token = jwt.sign(body, process.env.JWT_SECRET, { expiresIn: lifeTime });

        return token;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.removeToken = (req, res, next) => {
    console.log(req.cookies);

    res.clearCookie('token').send();
}

exports.isValidToken = (token) => {
    try {
        if (!token) {
            return false;
        }
        const decrypt = jwt.verify(token, process.env.JWT_SECRET);
        
        return decrypt.id;
    } catch (err) {
        console.log(err);
        throw err;
    }

}