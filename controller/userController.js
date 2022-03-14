const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const generateToken = require('../utils/genarateToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendMail');
const { validateEmail } = require('../utils/validateEmail');

exports.loginUser = asyncHandler(async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id : user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            barCode: user.ranNum
        })
    }else {
        res.json({msg: 'Please try again letter'})
    }
})

exports.getUserProfile =asyncHandler( async (req, res) =>{
    // console.log(req);
    const user = await User.findById(req.user._id);
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }else{
        res.status(404);
        throw new Error('User not found');
    }
})


// user register api/users/register

// exports.registerUser =asyncHandler( async (req,res) =>{
//     const {name, email, password } = req.body;
//     const userExists = await User.findOne({email});
//     if(userExists){
//         res.status(400);
//         throw new Error("User already exists");
//     };
//     const user = await User.create({name, email, password});
//     if(user){
//         res.status(201).json({
//             _id : user._id,
//             name : user.name,
//             email: user.email,
//             isAdmin: user.isAdmin,
//             token: generateToken(user._id)
//         })
//     }
// })



exports.registerUser =asyncHandler( async (req,res) =>{
    const {name, email, password, ranNum } = req.body;
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill in all fields");
    }
    if(!validateEmail(email)){
        res.status(400)
        throw new Error("Invalid emails");
    }
    if(password.length < 6){
        res.status(400)
        throw new Error("Password must be at least 6 characters");
    }
    // const passwordHash = await bcrypt.hash(password, 12);

    const newUser = {
        name, email, password, ranNum
    }
    // console.log(newUser)
    const activetion_token = createActivationToken(newUser)
    // console.log(activetion_token)
    const url = `${process.env.CLIENT_URL}/#/user/activate/${activetion_token}`
    // console.log(url)
    sendEmail(email, url, "Verify your Mail address",);
    res.json({msg: "Register Success! Please activate your email to start."})
    // const user = await User.create({name, email, password});
    // if(user){
        // res.status(201).json({
            // _id : user._id,
            // name : user.name,
            // email: user.email,
            // isAdmin: user.isAdmin,
            // token: generateToken(user._id)
        // })
    // }
})


exports.activeEmail = asyncHandler( async(req, res) =>{
    const {activetion_token} = req.body
    const user = jwt.verify(activetion_token, process.env.JWT_SECRET)
    const {name, email, password, ranNum} = user;
    // console.log(name,email, password)
    const userExists = await User.findOne({email});
        if(userExists){
            res.status(400);
            throw new Error("User already exists");
        };
    const resUser = await User.create({name, email, password, ranNum});
        if(resUser){
            res.status(201).json({
                _id : resUser._id,
                name : resUser.name,
                email: resUser.email,
                isAdmin: resUser.isAdmin,
                token: generateToken(resUser._id),
                barCode: resUser.ranNum
            })
        }
}

)
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '5d'})
}


exports.updateUserProfile =asyncHandler( async(req,res)=>{
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        if(req.body.password){
            user.password = req.body.password
        }
        const updateUser = await user.save();
        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email:updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser._id),
            barCode: updateUser.ranNum
        })
    }else{
        res.status(404);
        throw new Error('User Not found');
    }
})

exports.getUsers =asyncHandler( async (req, res)=>{
    const users = await User.find({});
    if(users){
        res.json(users);
    }else{
        throw new Error('Not authrized, token filed')
    }

})

exports.deleteUsers =asyncHandler( async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        await user.remove();
        res.json({message: "User removed"});
    }else{
        res.status(404)
        throw new Error("User not found");
    }
})

exports.getUserById = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.json(user);
    }else{
        res.status(404)
        throw new Error('User not found');
    }
})

exports.updateUser = asyncHandler(async (req, res) =>{
    const user = await User.findById(req.params.id)
    if(user){
        user.name = req.body.name || user.name
        user.isAdmin = req.body.isAdmin;
        const updateUser = await user.save();
        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            isAdmin: updateUser.isAdmin,
        })
    }else{
        res.status(404);
        throw new Error('User Not found');
    }
})

exports.forgotPassword =asyncHandler( async (req,res) =>{
    const { email } = req.body;
    if(!email){
        res.status(400)
        throw new Error("Please fill in all fields");
    }
    if(!validateEmail(email)){
        res.status(400)
        throw new Error("Invalid emails");
    }

    const newUser = {
        email
    }
    // console.log(newUser)
    const activetion_token = createActivationToken(newUser)
    // console.log(activetion_token)
    const url = `${process.env.CLIENT_URL}/#/user/forgotpassword/${activetion_token}`
    // console.log(url)
    sendEmail(email, url, "Please Reset Your Password",);
    res.json({msg: "Please check your E-mail"})
})


exports.resetpassword = async(req, res) =>{
    const {activetion_token, password} = req.body
    const {email} = jwt.verify(activetion_token, process.env.JWT_SECRET)
    console.log(email, password, activetion_token)
    const user = await User.findOne({email});
    console.log(user)
    if(user){
        if(password){
            user.password = password
        }
        const updateUser = await user.save();
        res.json({
            msg: "Your password reset successfully",
            updateUser
        })
    }else{
        res.status(404);
        throw new Error('User Not found');
    }
}
