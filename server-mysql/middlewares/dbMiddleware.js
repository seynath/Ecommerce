// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     // connectionLimit: 10,
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DB
// });

// module.exports = (req, res, next) => {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error getting MySQL connection:', err);
//             return next(err);
//         }

//         req.connection = connection;

//         res.on('finish', () => {
//             connection.release();
//         });

//         next();
//     });
// };



// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     connectionLimit: 10, // Adjust according to your needs
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DB
// });

// module.exports = (req, res, next) => {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             // Handle connection error
//             console.error('Error getting MySQL connection:', err);
//             return next(err);
//         }

//         req.connection = connection;

//         // Release the connection back to the pool when the response is finished
//         res.on('finish', () => {
//             connection.release();
//         });

//         next();
//     });
// };
