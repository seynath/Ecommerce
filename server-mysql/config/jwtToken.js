const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '3d',
        });
    } catch (error) {
        // Handle error
        console.error('Error generating token:', error);
        return null; // Or throw the error
    }
}

module.exports = generateToken;

// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '1d',
//     });
// }

// module.exports = generateToken;