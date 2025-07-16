const express = require('express');
const firmController = require('../controllers/firmController')
const verifyToken = require("../middlewares/verifyToken")

const router = express.Router()
router.post('/add-firm', verifyToken, firmController.addFirm);
router.delete('/:firmId', firmController.deleteFirmById)

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName
    res.setHeader('Content-type', 'image/jpeg');
    res.sendFile(Path.join(__dirname, '..', 'uploads', imageName))
})

module.exports = router