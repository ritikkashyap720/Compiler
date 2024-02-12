var jwt = require('jsonwebtoken');
var privateKey = "compiler@123456";

function setToken(user){
    var token = jwt.sign({id:user._id}, privateKey);
    return token
}

function getToken(token){
    try {
        var id = jwt.verify(token, privateKey);
        return id
        
    } catch (error) {
        return error
    }
}

module.exports ={
    setToken,
    getToken
}