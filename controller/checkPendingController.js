const asyncHandler = require('express-async-handler');
const CheckIn = require('../model/checkModel');
const CheckPending = require('../model/checkPending')
exports.checkInPending =asyncHandler( async (req,res) =>{
    const {name, check, time, date, lati, long, placedata, days} = req.body;
    const checked = new CheckPending({
        user: req.user._id,
        name,
        check,
        time,
        date,
        lati,
        long,
        placedata,
        days
    })
    const data = await checked.save();
    if(data){
        res.json(data);
    }
})

exports.postAdminCheckApprovePendingData =asyncHandler( async (req,res) =>{
    const {_id, user, name, check, time, date, lati, long, placedata, days} = req.body;
    const checked = new CheckIn({
        _id,
        user,
        name,
        check,
        time,
        date,
        lati,
        long,
        placedata,
        days
    })
    const data = await checked.save();
    if(data){
        res.json(data);
    }
})

exports.deletePendingCheck =asyncHandler( async(req, res)=>{
    const pendingCheckremove = await CheckPending.findById(req.params.id);
    if(pendingCheckremove){
        await pendingCheckremove.remove();
        res.json({message: "Pending check removed"});
    }else{
        res.status(404)
        throw new Error("User not found");
    }
})


// exports.getMyCheck =asyncHandler( async (req, res) => {
//     // console.log(req)
//     const checkData = await CheckIn.find({ user: req.user._id });
//     res.json(checkData)
//     // console.log(orders);
// });

exports.getAdminCheckPendingData = asyncHandler(async (req, res) => {
    const checkAll = await CheckPending.find({})
    res.json(checkAll)
});

// exports.getAllUsersForOptions =asyncHandler( async (req, res)=>{
//     const users = await User.find({});
//     // const id = users._id;
//     // const name = users.name;
//     // const data = users.forEach(d => {
//     //     return d;
//     // });
//     // for (let i = 0; i < users.length; i++) {
//     //     const element = users[i];
//     //     console.log(element);
//     // }
//     const data = users.map(user => {
//         const id = user._id;
//         const name = user.name
//         return {id,name};
//     })
//     // console.log(data);
//     res.json(data);
// })