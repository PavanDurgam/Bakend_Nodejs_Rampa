const multer = require('multer');
const Firm = require('../models/Firm');
const Product = require('../models/Product');
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


const addProduct = async (req, res) => {
  const { productName, price, category, bestSeller, description } = req.body
  const image = req.file ? file.name : undefined;
  try {
    const firmId = req.params.firmId
    const firm = await Firm.findById(firmId)
    if (!firm) {
      res.status(404).json({ erro: "firm was not found" })
    }
    const product = new Product({
      productName, price, category, bestSeller, description, image, firm: firm._id, firmName: firm.firmName
    })
    const savedProduct = await product.save();
    firm.products.push(savedProduct);
    await firm.save()
    res.status(200).json({ sucess: "sucessfully product is added" })

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal sever error in proucts" })

  }

}

const getProductByFirm = async (req, res) => {

  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    const offer = firm.offer
    if (!firm) {
      res.status(404).json({ err: "firm not found by id" })
    }
    const products = await Product.find({ firm: firmId })
    console.log(firm)
    console.log(offer)
    res.status(200).json(products)
  } catch (error) {
    console.error(error);
    res.status(500).json("internal sever error ")
  }
}

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId
    const deleteProduct = await Product.findByIdAndDelete(productId)
    if (!deleteProduct) {
      return res.status(404).json("product was not found")
    }
    res.status(200).json("product deleted sucessfully")
  } catch (error) {
    console.error(error);
    res.status(500).json("internal sever error ")
  }
}



module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById };