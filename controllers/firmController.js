const multer = require("multer")
const Vendor = require('../models/Vendor')
const Firm = require("../models/Firm")
const path = require('path')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')

  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})
const upload = multer({ storage: storage })


const addFirm = async (req, res) => {
  const { firmName, area, category, region, offer } = req.body
  const image = req.file ? req.file.filename : undefined;
  try {
    const vendor = await Vendor.findById(req.vendorId)
    if (!vendor) {

      return res.status(401).json({ error: "vendor not found" })
    }
    const firm = new Firm(
      { firmName, area, category, region, offer, image, vendor: vendor._id }
    )
    const SavedFirm = await firm.save();
    vendor.firm.push(SavedFirm);
    await vendor.save();

    res.status(200).json({ sucess: "sucessfully firm added" })

  } catch (error) {
    console.log(error)
    res.status(500).json("internal server error")
  }

}

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId
    const deleteFirm = await Firm.findByIdAndDelete(firmId)
    if (!deleteFirm) {
      return res.status(404).json("Firm was not found")
    }
    res.status(200).json("Firm deleted sucessfully")
  } catch (error) {
    console.error(error);
    res.status(500).json("internal sever error ")
  }
}

module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById }
