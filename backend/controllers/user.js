const { setToken } = require("../auth/handleJwt");
const User = require("../model/user")
var jwt = require('jsonwebtoken');

async function handleSignin(req,res){
   const {name,email,password} = req.body
   if(name && email && password ){
    try {
        await User.create({
            name:name,
            email:email,
            password:password
         })
         res.json({msg:"success"})   
        } catch (error) {
        if(error.code=="11000"){
            res.json({err:"Email already exist"})
        } 
    }    
    }else{
        res.json({err:"All field are required"})
    }
}
async function handleLogin(req,res){
    const {email,password} = req.body;
    if(email && password){
        try {
            const user = await User.findOne({email,password})
            if(user){
                const token = setToken(user)
                res.json({token:token,name:user.name,id:user._id})
            }else{
                res.json({err:"wrong username or password"})
            }
        } catch (error) {
            res.json({err:"internal error"+error})
        }
    }else{
        res.json({err:"All field are required"})
    }
}

module.exports ={
    handleSignin,
    handleLogin
}