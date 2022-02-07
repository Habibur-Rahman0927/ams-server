const express = require('express');
const router = express.Router();
const { checkIn, getMyCheck, getAdminCheckData,getAllUsersForOptions, facedescriptor, faceApiDes, getAdminCheckDataByFilter, getAdminPagination } = require('../controller/checkController');



const {protect, admin} = require('../middleware/authUserMiddleware');

router.route('/check').get(protect, getMyCheck)
router.route('/select').get(protect, getAllUsersForOptions).post(protect, checkIn);
// router.route('/adcheck').get(protect,admin, getAdminCheckData);
router.route('/adchecktesting').get(protect, admin, getAdminPagination);
router.route('/adcheckbyfilter').get(protect,admin, getAdminCheckDataByFilter);
router.route('/faceapi/descriptor').post( facedescriptor)
router.route('/faceapi/faechAll').get(faceApiDes)

module.exports = router;