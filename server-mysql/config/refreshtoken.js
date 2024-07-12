const jwt = require('jsonwebtoken');


const generateRefreshToken = (id) => {

    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '3d',
        });
    } catch (error) {
        // Handle error
        console.error('Error generating refresh token:', error);
        return null; // Or throw the error
    }
}

module.exports = generateRefreshToken;


// const jwt = require('jsonwebtoken');

// const generateRefreshToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '3d',
//     });
// }

// module.exports = generateRefreshToken;