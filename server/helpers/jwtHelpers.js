const jwt = require('jsonwebtoken');

exports.createToken = async (res, body) => {

    let token = null;
    const lifeTime = 3600 * 24 * 1000;

    try {

        token = jwt.sign(body, process.env.JWT_SECRET, { expiresIn: lifeTime });

        console.log(token);

        return res.cookie('token', token, {
            expires: new Date(Date.now() + lifeTime),
            secure: false,
            httpOnly: true,
        }).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

exports.removeToken = (req, res, next) => {
    console.log(req.cookies);

    res.clearCookie('token').send();
}

exports.isValidToken = async (req, res, next) => {
    const token = req.cookies ? req.cookies.token : false;
    try {
        if (!token) {
            return res.status(401).json('You should to Login')
        }
        const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decrypt.id,
            nick: decrypt.nick,
        };
        console.log(req.user);
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }

}
