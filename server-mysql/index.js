const express = require('express');
const path = require('path');
const { checkConnection } = require('./config/db'); // adjust the path according to your project structure
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;
const authRoute = require('./routes/authRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const productRoute = require('./routes/productRoute');
const categoryRouter = require('./routes/prodCategoryRoute');
const couponRouter = require("./routes/couponRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const sizeRoute = require("./routes/sizeRoute")
const supplierRouter = require("./routes/supplierRoute")
const reportRoute = require("./routes/reportRoute")
const cashierRoute = require("./routes/cashierRoute")
const orderRoute = require("./routes/orderRoute")
const chartRoute = require("./routes/chartRoute")
const { db } = require("./config/db")

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
})

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/category', categoryRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/size", sizeRoute);
app.use('/api/supplier', supplierRouter);
app.use('/api/report', reportRoute);
app.use('/api/cashier', cashierRoute);
app.use('/api/order', orderRoute);
app.use("/api/chart", chartRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// const express = require('express');
// const { checkConnection } = require('./config/db'); // adjust the path according to your project structure
// const app = express();
// require("dotenv").config();
// const PORT = process.env.PORT || 5001;
// const authRoute = require('./routes/authRoute');
// const bodyParser = require('body-parser');
// const { notFound, errorHandler } = require('./middlewares/errorHandler');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const morgan = require('morgan');
// const productRoute = require('./routes/productRoute');
// const categoryRouter = require('./routes/prodCategoryRoute');
// const couponRouter = require("./routes/couponRoute");
// const colorRouter = require("./routes/colorRoute");
// const enqRouter = require("./routes/enqRoute");
// const sizeRoute = require("./routes/sizeRoute")
// const supplierRouter = require("./routes/supplierRoute")
// const reportRoute = require("./routes/reportRoute")
// const cashierRoute = require("./routes/cashierRoute")
// const orderRoute = require("./routes/orderRoute")
// const chartRoute = require("./routes/chartRoute")
// const {db} = require("./config/db")

// db.connect((err)=>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Connected to the database");
//   }
// })

// app.use(morgan("dev"));
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use('/api/user', authRoute);
// app.use('/api/product', productRoute);
// app.use('/api/category', categoryRouter);
// app.use("/api/coupon", couponRouter);
// app.use("/api/color", colorRouter);
// app.use("/api/enquiry", enqRouter);
// app.use("/api/size", sizeRoute);
// app.use('/api/supplier',supplierRouter);
// app.use('/api/report',reportRoute);
// app.use('/api/cashier', cashierRoute)
// app.use('/api/order', orderRoute)
// app.use("/api/chart" , chartRoute )
// app.use(notFound);
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// }
// );



//below
// checkConnection()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Error starting the server:', err);
//   });














// const express = require('express');
// const dbConnect = require('./config/dbConnect');
// const app = express();
// const dotenv = require('dotenv').config();
// const PORT = process.env.PORT || 4000;
// const authRoute = require('./routes/authRoute');
// const bodyParser = require('body-parser');
// const { notFound, errorHandler } = require('./middlewares/errorHandler');
// const cookieParser = require('cookie-parser');
// const cors  = require('cors');
// const mysql = require('mysql2');
// const dbMiddleware = require('./middlewares/dbMiddleware');


// app.use(dbMiddleware);


// const productRoute = require('./routes/productRoute');
// const blogRouter = require('./routes/blogRoute');
// const categoryRouter = require('./routes/prodCategoryRoute');
// const blogcategoryRouter = require("./routes/blogCatRoute");
// const brandRouter = require("./routes/brandRoute");
// const couponRouter = require("./routes/couponRoute");
// const morgan = require('morgan')
// const colorRouter = require("./routes/colorRoute");
// const enqRouter = require("./routes/enqRoute");

// // dbConnect();
// app.use(morgan("dev"))
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use('/api/user', authRoute);
// app.use('/api/product', productRoute);
// app.use('/api/blog', blogRouter);
// app.use('/api/category', categoryRouter);
// app.use("/api/blogcategory", blogcategoryRouter);
// app.use("/api/brand", brandRouter);
// app.use("/api/coupon",couponRouter);
// app.use("/api/color", colorRouter);
// app.use("/api/enquiry", enqRouter); 


// //mekata yatin mewa thiyen oona
// app.use(notFound);
// app.use(errorHandler);


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
