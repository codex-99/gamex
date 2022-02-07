const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
    try{
        // var token = req.body.jwt
        var token = req.headers.authorization.split(" ")[1];
        console.log(token);
        jwt.verify(token, "thisisMySecretKeyTheHouseMonk");
        next();
    }catch(e){
        console.log(e)
        res.status(401).json({
            message: 'Failed JWT auth'
        })
    }
}