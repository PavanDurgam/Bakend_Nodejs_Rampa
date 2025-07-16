const jwt = require("jsonwebtoken")
const dotEnv = require('dotenv')
const bcrypt = require('bcrypt')
const Vendor = require('../models/Vendor')

dotEnv.config()
const secertKey = process.env.jwtTokenSecertyKey



const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const VendorEmail = await Vendor.findOne({ email })
        if (VendorEmail) {
            console.log("email is already exists")
            return res.status(400).json("the given email is already exists")

        } else {
            const hashedpassword = await bcrypt.hash(password, 10)

            const newVendor = await new Vendor({
                username,
                email,
                password: hashedpassword
            })
            await newVendor.save();
            res.status(200).json("vendor sucessfully registered")
            console.log("registerd sucessfuly")
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "internal server error" })
    }
}

const vendorLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const vendor = await Vendor.findOne({ email })
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            res.status(401).json({ error: "email || password are not matched" })
        }
        const token = jwt.sign({ vendorId: vendor._id }, secertKey, { expiresIn: '1h' })

        res.status(200).json({ sucess: "login sucessfully", token })
        console.log("login sucessfully", token)

    } catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)
    }
}

const getAllVendors = async (req, res) => {
    try {
        const vendor = await Vendor.find().populate('firm')

        res.json({ vendor })

    } catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.log(error)
    }
}

const getByVendorId = async (req, res) => {
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId)
        if (!vendor) {
            res.status(404).json({ msg: "vendor not found" })
        }
        res.status(200).json({ vendor })
    } catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.log(error)
    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors,getByVendorId }