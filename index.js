const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRoute = require('./routes/authRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const productRoute = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const morgan = require('morgan')

dbConnect();
app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRouter);
//mekata yatin mewa thiyen oona
app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
