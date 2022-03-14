const express = require('express');
const router = express.Router();
const {
        registerUser,
        loginUser,
        getUserProfile, 
        updateUserProfile, 
        getUsers, 
        deleteUsers, 
        getUserById, 
        updateUser,
        activeEmail,
        forgotPassword,
        resetpassword, 
} = require('../controller/userController');
const {protect, admin} = require('../middleware/authUserMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);// admin show all user
router.route('/activetion').post(activeEmail)
router.route('/resetpassword').put(resetpassword)
router.route('/login').post(loginUser);
router.route('/profile').get(protect,getUserProfile).put(protect, updateUserProfile);
router.route('/forgotpassword').post(forgotPassword);
router.route('/:id')
.delete(protect, admin, deleteUsers)
.get(protect, admin, getUserById)
.put(protect, admin, updateUser);

module.exports = router;