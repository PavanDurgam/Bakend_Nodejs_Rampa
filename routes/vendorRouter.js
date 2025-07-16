const express = require('express')
const VendorController = require('../controllers/venderController')


const router = express.Router()

router.post('/register', VendorController.vendorRegister)
router.post('/login', VendorController.vendorLogin)

router.get('/all-vendors', VendorController.getAllVendors)
router.get('/single-vendor/:id', VendorController.getByVendorId)




module.exports = router