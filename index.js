const Express = require("express")
const dotEnv = require("dotenv")
const mongoose = require("mongoose")
const venderRouter = require('./routes/vendorRouter')
const bodyParser = require('body-parser')
const firmRouters = require('./routes/firmRoutes')
const productRouter = require('./routes/productRouter')
const cors = require('cors')

dotEnv.config();
const app = Express()
app.use(cors())
const port = process.env.PORT || 4000
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log("connected Sucessfully!"))
   .catch((error) => console.log(error));


app.use('/vendor', venderRouter)
app.use('/firm', firmRouters)
app.use('/product', productRouter);



app.listen(port, () => { console.log(`server was sucessfully connected at port: ${port}`) })


app.use('/', (req, res) => {
   res.send("<h2>welcome to rampa")
})
