const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const CheckIn = require('../model/checkModel');
const Faceapi = require('../model/faceapiModel');
exports.checkIn =asyncHandler( async (req,res) =>{
    const {name, check, time, date, lati, long, placedata} = req.body;
    const checked = new CheckIn({
        user: req.user._id,
        name,
        check,
        time,
        date,
        lati,
        long,
        placedata
    })
    const data = await checked.save();
    if(data){
        res.json(data);
    }
})
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
});

exports.getMyCheck =asyncHandler( async (req, res) => {
    const checkData = await CheckIn.find({ user: req.user._id });
    res.json(checkData)
    // console.log(orders);
});

// exports.getAdminCheckData =asyncHandler(async (req, res) => {
//     const pageSize = 10;
//     const page = Number(req.query.pageNumber) || 1
//     const keyword = req.query.keyword ? {
//         name: {
//             $regex: req.query.keyword,
//             $options: 'i'
//         }
//     } : {}
//     const count = await CheckIn.countDocuments({ ...keyword })
//     const checkAll = await CheckIn.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
//     res.json({ checkAll, page, pages: Math.ceil(count / pageSize) })
// });

//
exports.getAdminPagination = async(req, res) => {
    try {
        // const page = parseInt(req.query.page); // Make sure to parse the page to number
        // We are using the '3 layer' architecture explored on the 'bulletproof node.js architecture'
        // Basically, it's just a class where we have our business logic
        // const userService = new CheckIn();
        const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    //   const skip = parseInt(req.query.skip)
        const users = await CheckIn.find({}).limit(limit);
        return res.status(200).json(users);
      } catch(e){
        return res.status(500).json(e)
      }
}
//
exports.getAdminCheckDataByFilter = asyncHandler(async (req, res) => {
    const checkAll = await CheckIn.find({})
    res.json(checkAll)
});

exports.getAllUsersForOptions =asyncHandler( async (req, res)=>{
    const users = await User.find({});
    // const id = users._id;
    // const name = users.name;
    // const data = users.forEach(d => {
    //     return d;
    // });
    // for (let i = 0; i < users.length; i++) {
    //     const element = users[i];
    //     console.log(element);
    // }
    const data = users.map(user => {
        const id = user._id;
        const name = user.name
        const barCode = user.ranNum
        return {label:name, value:id};
    })
    // console.log(data);
    res.json(data);
})

exports.facedescriptor = async (req, res) => {
    const {name, discriptor} = req.body
    const discriptorArray = Object.values(discriptor)
    const dis = new Faceapi({
        name,
        reviews:discriptor
    })
    const data = await dis.save()
    res.json(data)

}

exports.faceApiDes = async (req, res) => {
    const data = await Faceapi.find({})
    res.json(data)

}