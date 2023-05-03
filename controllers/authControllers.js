const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

let refreshTokens=[];
const authController={
    //register
    registerUser: async(req,res)=>{
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password,salt);
            
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });
            const user = await newUser.save();
                res.status(200).json(user);  

        }catch(err){
            res.status(500).json(err);
        }
    },
    // generate
    generateAccessToken:(user)=>{
        return jwt.sign(
            {   
                id: user.id,
                admin: user.admin,
            },
                process.env.JWT_ACCESS_KEY,
                {expiresIn: "20s"}
                );

    },
    generateRefreshToken:(user)=>{
        return jwt.sign(
            {   
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_PREFFESH_KEY,
            {expiresIn: "365d"
            });
    },
    //login
    loginUser: async(req, res) => {
        try{
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("Incorrect username");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!validPassword){
                res.status(404).json("Incorrect password");
            }
            if(user && validPassword){
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshToken.push(refreshToken);
                res.cookie("refreshToken",newrefreshToken,{
                    httpOnly:true,
                    secure:false,
                    path:"/",
                    sameSite:"strict",
                }) 
                const {password,...others} = user._doc;
                res.status(200).json({...others, accessToken});
            }

        }catch(err){
            res.status(500).json(err);
    
        }
    },    
        requestRefreshToken: async(req,res)=>{
            const refreshToken = req.cookies.refreshToken;
            res.status(200).json(refreshToken);
            if (!refreshToken) return res.status(401).json("You're not authenticated");
            if(!refreshTokens.includes(refreshToken)){
                return res.status(403).json("refresh token is not valid");
            }
                jwt.verify(refreshToken,print.env.JWT_PREFFESH_KEY,(err,user)=>{
                    if(err){
                        console.log(err);
                    }
                    refreshTokens= refreshTokens.filter((token)=>token !== refreshToken);
                    const newAccessToken= authController.generateAccessToken(user);
                    const newRefeshToken= authController.generateRefreshToken(user);
                    refreshTokens.push(newRefeshToken);
                    res.cookie("refreshToken",newrefreshToken,{
                        httpOnly:true,
                        secure:false,
                        path:"/",
                        sameSite:"strict",
                    });
                    res.status(200).json({accessToken: newAccessToken});
                });
            },
    //log out
    userLogout: async(req,res)=>{
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out");
    }   
    

};


module.exports = authController;