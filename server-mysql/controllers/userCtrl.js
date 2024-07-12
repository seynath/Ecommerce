const asyncHandler = require("express-async-handler");
const generateToken = require("../config/jwtToken");
const generateRefreshToken = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("../controllers/emailCtrl");
const crypto = require("crypto");
const uniqid = require("uniqid");
const { db, pool } = require("../config/db");
// const { pool } = require("../config/db"); // import the connection pool
const saltRounds = 10;
const bcrypt = require("bcrypt");
const { resolve } = require("path");
const { rejects } = require("assert");
const { log } = require("console");

const createUser = asyncHandler(async (req, res) => {
  try {
    const { firstname, lastname, email, mobile, password } = req.body;
    console.log(req.body);
    const role = "user";

    
    const existingUsers = await new Promise((resolve, rejects) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) {
          rejects(err);
        }
        resolve(rows);
      });
    });
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create a new user
    
    const result = await new Promise((resolve, rejects) => {
      db.query(
        "INSERT INTO users (firstname, lastname, email, mobile, password, role) VALUES (?, ?, ?, ?, ?, ?)",
        [firstname, lastname, email, mobile, hashedPassword, role],
        (err, rows) => {
          if (err) {
            rejects(err);
          }
          resolve(rows);
        }
      );
    });
    
    // Create an empty cart for the new user
    
    await new Promise((resolve, rejects) => {
      db.query(
        "INSERT INTO cart (user_id) VALUES (?)",
        [result.insertId],
        (err, rows) => {
          if (err) {
            rejects(err);
          }
          resolve(rows);
        }
      );
    });
    const id = result.insertId

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get a connection from the pool

    // Check if user with the given email exists
    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    const user = rows[0];
    // if (!user) {
    //   connection.release();
    //   throw new Error("User not found")}

    if (rows.length === 0 || !user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Generate a JSON Web Token (JWT) for the user
    const token = generateToken(user.id);
    // store the token in user table , refreshToken field
    // const [rows1] = await connection.execute(
    //   "UPDATE users SET refreshToken = ? where id = ?",
    //   [token, user.id]
    // );

    // if (rows1.length === 0) {
    //   connection.release();
    //   return res.status(401).json({ message: "Server Error" });
    // }

    // Send the user data and token as a response
    res.status(200).json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Get a connection from the pool
//     const connection = await pool.getConnection();

//     // Check if user with the given email exists
//     const [rows] = await connection.execute(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );
//     const user = rows[0];
//     // if (!user) {
//     //   connection.release();
//     //   throw new Error("User not found")}

//     if (rows.length === 0 || !user) {
//       connection.release();
//       return res.status(401).json({ message: "Invalid Credentials" });
//     }

//     // Compare the provided password with the hashed password stored in the database
//     const passwordMatched = await bcrypt.compare(password, user.password);

//     if (!passwordMatched) {
//       connection.release();
//       return res.status(401).json({ message: "Invalid Credentials" });
//     }

//     // Generate a JSON Web Token (JWT) for the user
//     const token = generateToken(user.id);
//     // store the token in user table , refreshToken field
//     // const [rows1] = await connection.execute(
//     //   "UPDATE users SET refreshToken = ? where id = ?",
//     //   [token, user.id]
//     // );

//     // if (rows1.length === 0) {
//     //   connection.release();
//     //   return res.status(401).json({ message: "Server Error" });
//     // }

//     connection.release();

//     // Send the user data and token as a response
//     res.status(200).json({
//       id: user.id,
//       firstname: user.firstname,
//       lastname: user.lastname,
//       email: user.email,
//       mobile: user.mobile,
//       isAdmin: user.isAdmin,
//       token: token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get a MySQL connection from the pool

    // Execute a SELECT query to find the user with the provided email
    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    const findAdmin = rows[0];

    if (!findAdmin) {
      throw new Error("Email not found");
    }

    // Check if the user is an admin
    if (findAdmin.role !== "admin") {
      throw new Error("Unauthorized access");
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatched = await bcrypt.compare(password, findAdmin.password);

    if (!passwordMatched) {
      throw new Error("Incorrect password");
    }

    // Generate a refresh token
    const refreshToken = await generateRefreshToken(findAdmin.id);

    // Update the user's refresh token in the database
    // const [rows1] = await connection.execute(
    //   "UPDATE users SET refreshToken = ? WHERE id = ?",
    //   [refreshToken, findAdmin.id]
    // );

    // if (rows1.length === 0) {
    //   connection.release();
    //   throw new Error("Server Error");
    // }

    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    // Send the user's information along with an access token in the response
    res.status(200).json({
      _id: findAdmin.id,
      firstname: findAdmin.firstname,
      lastname: findAdmin.lastname,
      email: findAdmin.email,
      mobile: findAdmin.mobile,
      isAdmin: findAdmin.role,
      token: refreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const loginCashier = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get a MySQL connection from the pool

    // Execute a SELECT query to find the user with the provided email

    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    const findCashier = rows[0];

    if (!findCashier) {
      throw new Error("Email not found");
    }

    // Check if the user is an admin
    if (findCashier.role !== "cashier" && findCashier.role !== "admin") {
      throw new Error("Unauthorized access");
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatched = await bcrypt.compare(
      password,
      findCashier.password
    );

    if (!passwordMatched) {
      throw new Error("Incorrect password");
    }

    // Generate a refresh token
    const refreshToken = await generateRefreshToken(findCashier.id);

    // Update the user's refresh token in the database
    // const [rows1] = await connection.execute(
    //   "UPDATE users SET refreshToken = ? WHERE id = ?",
    //   [refreshToken, findCashier.id]
    // );

    // if (rows1.length === 0) {
    //   connection.release();
    //   throw new Error("Server Error");
    // }

    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    // Send the user's information along with an access token in the response
    res.status(200).json({
      _id: findCashier.id,
      firstname: findCashier.firstname,
      lastname: findCashier.lastname,
      email: findCashier.email,
      mobile: findCashier.mobile,
      isAdmin: findCashier.role,
      token: refreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
// const loginCashier = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Get a MySQL connection from the pool
//     const connection = await pool.getConnection();

//     // Execute a SELECT query to find the user with the provided email
//     const [rows] = await connection.execute(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );
//     const findCashier = rows[0];
//     console.log("athule");
//     console.log(findCashier);

//     if (!findCashier) {
//       connection.release();
//       throw new Error("Email not found");
//     }

//     // Check if the user is an admin
//     if ((findCashier.role !== "cashier" ) && (findCashier.role !== "admin") ) {
//       connection.release();
//       throw new Error("Unauthorized access");
//     }

//     // Compare the provided password with the hashed password stored in the database
//     const passwordMatched = await bcrypt.compare(
//       password,
//       findCashier.password
//     );

//     if (!passwordMatched) {
//       connection.release();
//       throw new Error("Incorrect password");
//     }

//     // Generate a refresh token
//     const refreshToken = await generateRefreshToken(findCashier.id);
//     console.log(refreshToken);

//     // Update the user's refresh token in the database
//     const [rows1] = await connection.execute(
//       "UPDATE users SET refreshToken = ? WHERE id = ?",
//       [refreshToken, findCashier.id]
//     );

//     if (rows1.length === 0) {
//       connection.release();
//       throw new Error("Server Error");
//     }

//     connection.release();

//     // Set the refresh token in a cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       maxAge: 72 * 60 * 60 * 1000,
//     });

//     // Send the user's information along with an access token in the response
//     res.status(200).json({
//       _id: findCashier.id,
//       firstname: findCashier.firstname,
//       lastname: findCashier.lastname,
//       email: findCashier.email,
//       mobile: findCashier.mobile,
//       isAdmin: findCashier.role,
//       token: refreshToken,
//     });
//   } catch (error) {
//     res.status(401).json({ message: error.message });
//   }
// };

const getallUser = async (req, res) => {
  try {
    // Execute a SELECT query to fetch all users
    const rows = await new Promise((resolve, rejects) => {
      db.query("SELECT * FROM users", (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      });
    });

    if (rows.length === 0) {
      return res.status(404).json({ message: "No Users Found" });
    }

    // Send the fetched users in the response
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const getallUser = async (req, res) => {
//   try {
//     // Get a MySQL connection from the pool
//     const connection = await pool.getConnection();

//     // Execute a SELECT query to fetch all users
//     const [rows] = await connection.execute("SELECT * FROM users");
//     if (rows.length === 0) {
//       connection.release();
//       return res.status(404).json({ message: "No Users Found" });
//     }
//     connection.release();

//     // Send the fetched users in the response
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getaUser = async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      });
    });

    // Check if user with the given ID exists
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the fetched user in the response
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const getaUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Get a MySQL connection from the pool
//     const connection = await pool.getConnection()
//     // Execute a SELECT query to fetch the user with the provided ID
//     const [rows] = await connection.execute("SELECT * FROM users WHERE id = ?", [id]);

//     connection.release();

//     // Check if user with the given ID exists
//     if (rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Send the fetched user in the response
//     res.json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const deleteaUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Get a MySQL connection from the pool

    await new Promise((resolve, rejects) => {
      db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      });
    });

    // Send a success response
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete user
// const deleteaUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);

//   try {
//     const deleteaUser = await User.findByIdAndDelete(id);
//     res.json({
//       deleteaUser,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const updatedUser = async (req, res) => {
  // Retrieve the user ID from the request parameters
  // const { id } = req.params;
  const { id } = req.user;

  try {
    // Get user data from request body
    const { firstname, lastname, email, mobile } = req.body;

    // Get a MySQL connection from the pool

    const result = await new Promise((resolve, rejects) => {
      db.query(
        "UPDATE users SET firstname = ?, lastname = ?, email = ?, mobile = ? WHERE id = ?",
        [firstname, lastname, email, mobile, id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    // Check if user was updated successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the updated user data in the response
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//////////////
//////////////
//////////////

const saveAddress = async (req, res) => {
  // Retrieve the user ID from the request parameters

  //const { id } = req.user;
  const { id } = req.params;

  try {
    // Get the address from the request body
    const { address } = req.body;

    // Get a MySQL connection from the pool
    const connection = req.connection;
    await checkConnection(connection);

    // Execute an UPDATE query to update the user's address
    const [result] = await connection
      .promise()
      .query("UPDATE users SET address = ? WHERE id = ?", [address, id]);

    connection.release();

    // Check if user was updated successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the updated user data in the response
    res.json({ message: "Address saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  // Retrieve the user ID from the request parameters
  const { id } = req.params;

  try {
    // Get a MySQL connection from the pool
    const connection = req.connection;
    await checkConnection(connection);

    // Execute an UPDATE query to block the user
    const [result] = await connection
      .promise()
      .query("UPDATE users SET isBlocked = ? WHERE id = ?", [true, id]);

    connection.release();

    // Check if user was blocked successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the response
    res.json({ message: "User Blocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unblockUser = async (req, res) => {
  // Retrieve the user ID from the request parameters
  const { id } = req.params;

  try {
    // Get a MySQL connection from the pool
    const connection = req.connection;
    await checkConnection(connection);

    // Execute an UPDATE query to unblock the user
    const [result] = await connection
      .promise()
      .query("UPDATE users SET isBlocked = ? WHERE id = ?", [false, id]);

    connection.release();

    // Check if user was unblocked successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the response
    res.json({ message: "User Unblocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    // Extract the 'refreshToken' from cookies in the request
    const cookie = req.cookies;

    // Check if there is a 'refreshToken' in the cookies
    if (!cookie?.refreshToken) {
      // If not, send a 401 Unauthorized response with an error message
      return res.status(401).json({ message: "No Refresh Token in Cookies" });
    }

    // Retrieve the 'refreshToken' from the cookies
    const refreshToken = cookie.refreshToken;

    // Get a MySQL connection from the pool
    const connection = req.connection;
    await checkConnection(connection);

    // Execute a SELECT query to find the user with the provided 'refreshToken'
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM users WHERE refreshToken = ?", [refreshToken]);
    const user = rows[0];

    connection.release();

    // If no user is found or the 'refreshToken' doesn't match, send an error response
    if (!user) {
      return res
        .status(401)
        .json({ message: "No Refresh token present in db or not matched" });
    }

    // Verify the 'refreshToken' using the JWT_SECRET
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      // If there's an error or the user ID in the token doesn't match the user ID in the database
      if (err || user.id !== decoded.id) {
        // Send an error response
        return res
          .status(401)
          .json({ message: "There is something wrong with the refresh token" });
      }

      // If verification is successful, generate a new access token
      const accessToken = generateToken(user.id);

      // Send the new access token in the response
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;

    // Get a MySQL connection from the pool
    const connection = req.connection;
    await checkConnection(connection);

    // Execute a SELECT query to find the user with the provided 'refreshToken'
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM users WHERE refreshToken = ?", [refreshToken]);
    const user = rows[0];

    // Clear the refreshToken cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    // If no user is found, send a 204 No Content response
    if (!user) {
      return res.sendStatus(204); // No Content
    }

    // Update the user's refreshToken to an empty string
    await connection
      .promise()
      .query("UPDATE users SET refreshToken = ? WHERE id = ?", ["", user.id]);

    connection.release();

    return res.sendStatus(204); // No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const forgotPasswordTokenAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email

    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    const user = rows[0];

    if (!user) {
      throw new Error("User not found with this email");
    }

    // Generate a password reset token
    const resetToken = crypto
      .createHash("sha256")
      .update(Math.random().toString(36))
      .digest("hex");

    // Update the user's password reset token in the database

    await new Promise((resolve, rejects) => {
      db.query(
        "UPDATE users SET passwordResetToken = ?, passwordResetExpires = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE id = ?",
        [resetToken, user.id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    // Send email with reset link
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${resetToken}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);

    res
      .status(200)
      .json({ message: "Password reset token sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email

    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    const user = rows[0];

    if (!user) {
      throw new Error("User not found with this email");
    }

    // Generate a password reset token
    const resetToken = crypto
      .createHash("sha256")
      .update(Math.random().toString(36))
      .digest("hex");

    // Update the user's password reset token in the database

    await new Promise((resolve, rejects) => {
      db.query(
        "UPDATE users SET passwordResetToken = ?, passwordResetExpires = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE id = ?",
        [resetToken, user.id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    // Send email with reset link
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3001/reset-password/${resetToken}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);

    res
      .status(200)
      .json({ message: "Password reset token sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const hashPassword = async (password) => {
  const saltRounds = 10; // Number of salt rounds for bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    // Hash the provided token

    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM users WHERE passwordResetToken = ? AND passwordResetExpires > NOW()",
        [token],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    const user = rows[0];

    if (!user) {
      throw new Error("Token expired or invalid");
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update the user's password and reset token fields in the database

    await new Promise((resolve, rejects) => {
      db.query(
        "UPDATE users SET password = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE id = ?",
        [hashedPassword, user.id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;

  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM wishlist WHERE user_id = ?",
        [id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    if (rows.length === 0) {
      return res.status(204).json([{ message: "No Wishlist Found" }]);
    }
    res.status(201).json(rows);
  } catch (error) {
    throw new Error(error);
  }
});
// const getWishlist = asyncHandler(async (req, res) => {
//   const { id } = req.user;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.execute(
//       "SELECT * FROM wishlist WHERE user_id = ?",
//       [id]
//     );
//     if (rows.length === 0) {
//       connection.release();
//       return res.status(204).json([{ message: "No Wishlist Found" }]);
//     }
//     connection.release();
//     res.status(201).json(rows);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

//add to cart

const userCart = asyncHandler(async (req, res) => {
  const { size_color_quantity_id, quantity, product_total } = req.body;
  const { id } = req.user;

  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query("SELECT * FROM cart WHERE user_id = ?", [id], (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      });
    });

    if (rows.length === 0) {
      await new Promise((resolve, rejects) => {
        db.query(
          "INSERT INTO cart (user_id) VALUES (?)",
          [id],
          (err, results) => {
            if (err) {
              rejects(err);
            }
            resolve(results);
          }
        );
      });
    }

    const rows1 = await new Promise((resolve, rejects) => {
      db.query("SELECT * FROM cart WHERE user_id = ?", [id], (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      });
    });

    const cart_id = rows1[0].cart_id;

    const rows2 = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM size_color_quantity WHERE size_color_quantity_id = ?",
        [size_color_quantity_id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    let availableQuantity = rows2[0].quantity;

    if (availableQuantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    const rows3 = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM cart_items WHERE cart_id = ? AND size_color_quantity_id = ?",
        [cart_id, size_color_quantity_id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    if (rows3.length === 0) {
      await new Promise((resolve, rejects) => {
        db.query(
          "INSERT INTO cart_items (cart_id, size_color_quantity_id, quantity, product_total) VALUES (?, ?, ?, ?)",
          [cart_id, size_color_quantity_id, quantity, product_total],
          (err, results) => {
            if (err) {
              rejects(err);
            }
            resolve(results);
          }
        );
      });
    } else {
      await new Promise((resolve, rejects) => {
        db.query(
          "UPDATE cart_items SET quantity = ?, product_total= ? WHERE cart_id = ? AND size_color_quantity_id = ?",
          [quantity, product_total, cart_id, size_color_quantity_id],
          (err, results) => {
            if (err) {
              rejects(err);
            }
            resolve(results);
          }
        );
      });
    }

    res.status(200).json({ message: "Cart Data Received" });
  } catch (error) {
    throw new Error(error);
  }
});
// const userCart = asyncHandler(async (req, res) => {
//   const { size_color_quantity_id, quantity, product_total } = req.body;
//   const { id } = req.user;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.execute(
//       "SELECT * FROM cart WHERE user_id = ?",
//       [id]
//     );
//     if (rows.length === 0) {
//       await connection.execute("INSERT INTO cart (user_id) VALUES (?)", [id]);
//     }
//     const [rows1] = await connection.execute(
//       "SELECT * FROM cart WHERE user_id = ?",
//       [id]
//     );
//     const cart_id = rows1[0].cart_id;
//     const [rows2] = await connection.execute(
//       "SELECT * FROM size_color_quantity WHERE size_color_quantity_id = ?",
//       [size_color_quantity_id]
//     );
//     let availableQuantity = rows2[0].quantity;

//     if (availableQuantity < quantity) {
//       connection.release();
//       return res.status(400).json({ message: "Not enough quantity available" });
//     }

//     const [rows3] = await connection.execute(
//       "SELECT * FROM cart_items WHERE cart_id = ? AND size_color_quantity_id = ?",
//       [cart_id, size_color_quantity_id]
//     );
//     if (rows3.length === 0) {
//       await connection.execute(
//         "INSERT INTO cart_items (cart_id, size_color_quantity_id, quantity, product_total) VALUES (?, ?, ?, ?)",
//         [cart_id, size_color_quantity_id, quantity, product_total]
//       );
//     } else {
//       await connection.execute(
//         "UPDATE cart_items SET quantity = ?, product_total= ? WHERE cart_id = ? AND size_color_quantity_id = ?",
//         [quantity, product_total, cart_id, size_color_quantity_id]
//       );
//     }
//     connection.release();

//     res.status(200).json({ message: "Cart Data Received" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const getUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;

  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT c.*, ci.* FROM cart c LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id WHERE c.user_id = ?",
        [id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    if (rows.length === 0) {
      return res.status(404).json({ message: "No Cart Found" });
    }

    let productDetailsPromises = [];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      if (row.size_color_quantity_id) {
        // add null check for size_color_quantity_id
        try {
          const productRows = await new Promise((resolve, rejects) => {
            db.query(
              `
                SELECT p.*, scq.size_id, scq.color_code, scq.quantity as size_color_quantity, scq.unit_price, s.size_name, c.col_name, i.image_link
        FROM product p
        JOIN size_color_quantity scq ON p.p_id = scq.product_id
        JOIN size s ON s.size_id = scq.size_id
        JOIN color c ON c.col_code = scq.color_code
        JOIN image i ON i.product_id = p.p_id
        WHERE scq.size_color_quantity_id = ?
        `,
              [row.size_color_quantity_id],
              (err, results) => {
                if (err) {
                  rejects(err);
                }
                resolve(results);
              }
            );
          });

          const availableQuantity = productRows[0].size_color_quantity;
          const cartQuantity = row.quantity;

          // Update cart quantity if it's greater than the available quantity
          if (cartQuantity > availableQuantity) {
            await new Promise((resolve, rejects) => {
              db.query(
                `UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?`,
                [availableQuantity, row.cart_item_id],
                (err, results) => {
                  if (err) {
                    rejects(err);
                  }
                  resolve(results);
                }
              );
            });
            row.quantity = availableQuantity;
          }

          productDetailsPromises.push({
            ...row,
            productDetails: productRows[0],
          });
        } catch (error) {
          console.error(error);
          // Handle the error appropriately, maybe by returning an empty object or null
          productDetailsPromises.push(null);
        }
      }
    }

    const cartWithProductDetails = await Promise.all(productDetailsPromises);

    res.status(200).json(cartWithProductDetails.filter(Boolean)); // filter out null values
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});
// const getUserCart = asyncHandler(async (req, res) => {
//   const { id } = req.user;

//   try {
//     const connection = await pool.getConnection();

//     // Get cart and cart_items data in a single query
//     const [rows] = await connection.execute(
//       "SELECT c.*, ci.* FROM cart c LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id WHERE c.user_id = ?",
//       [id]
//     );

//     if (rows.length === 0) {
//       connection.release();
//       return res.status(404).json({ message: "No Cart Found" });
//     }

//     let productDetailsPromises = [];
//     for (let i = 0; i < rows.length; i++) {
//       let row = rows[i];
//       if (row.size_color_quantity_id) {
//         // add null check for size_color_quantity_id
//         try {
//           const [productRows] = await connection.execute(
//             `SELECT p.*, scq.size_id, scq.color_code, scq.quantity as size_color_quantity, scq.unit_price, s.size_name, c.col_name, i.image_link
//         FROM product p
//         JOIN size_color_quantity scq ON p.p_id = scq.product_id
//         JOIN size s ON s.size_id = scq.size_id
//         JOIN color c ON c.col_code = scq.color_code
//         JOIN image i ON i.product_id = p.p_id
//         WHERE scq.size_color_quantity_id = ?
//         `,
//             [row.size_color_quantity_id]
//           );

//           const availableQuantity = productRows[0].size_color_quantity;
//           const cartQuantity = row.quantity;

//           // Update cart quantity if it's greater than the available quantity
//           if (cartQuantity > availableQuantity) {
//             await connection.execute(
//               "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
//               [availableQuantity, row.cart_item_id]
//             );
//             row.quantity = availableQuantity;
//           }

//           productDetailsPromises.push({
//             ...row,
//             productDetails: productRows[0],
//           });
//         } catch (error) {
//           console.error(error);
//           // Handle the error appropriately, maybe by returning an empty object or null
//           productDetailsPromises.push(null);
//         }
//       }
//     }

//     const cartWithProductDetails = await Promise.all(productDetailsPromises);

//     connection.release();
//     res.status(200).json(cartWithProductDetails.filter(Boolean)); // filter out null values
//   } catch (error) {
//     console.error(error);
//     throw new Error(error);
//   }
// });

const removeFromCartItem = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params;
  const { id } = req.user;
  console.log(cartItemId);
  try {
    const sql = `DELETE FROM cart_items WHERE cart_item_id = ?`;

    const rows = await new Promise((resolve, rejects) => {
      db.query(sql, [cartItemId], (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      });
    });

    if (rows.length === 0) {
      res.status(400).json({ message: "Cart Item Not Found" });
    }

    res.status(200).json({ message: "Cart Item Removed" });
  } catch (error) {}
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

// const createOrder = asyncHandler(async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     mobile,
//     shippingAptNo,
//     shippingAddress,
//     shippingCity,
//     shippingState,
//     shippingZipcode,
//     shippingCountry,
//     billingAptNo,
//     billingAddress,
//     billingCity,
//     billingState,
//     billingZipcode,
//     billingCountry,
//     paymentMethod,
//     message,
//     totalPrice,
//   } = req.body;

//   console.log(
//     firstName,
//     lastName,
//     email,
//     mobile,
//     shippingAptNo,
//     shippingAddress,
//     shippingCity,
//     shippingState,
//     shippingZipcode,
//     shippingCountry,
//     billingAptNo,
//     billingAddress,
//     billingCity,
//     billingState,
//     billingZipcode,
//     billingCountry,
//     paymentMethod,
//     message,
//     totalPrice
//   );

//   const { id } = req.user;
//   const orderStatus = "Processing";

//   try {
    
//     const order_rows = await new Promise((resolve, rejects) => {
//       db.query(
//         "INSERT INTO orders (first_name, last_name, user_id, payment_method, email, mobile, order_status, message, shipping_apt_no, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, billing_apt_no, billing_address, billing_city, billing_state, billing_zip, billing_country, total_amount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//         [
//           firstName,
//           lastName,
//           id,
//           paymentMethod,
//           email,
//           mobile,
//           orderStatus,
//           message,
//           shippingAptNo,
//           shippingAddress,
//           shippingCity,
//           shippingState,
//           shippingZipcode,
//           shippingCountry,
//           billingAptNo,
//           billingAddress,
//           billingCity,
//           billingState,
//           billingZipcode,
//           billingCountry,
//           totalPrice,
//         ],
//         (err, results) => {
//           console.log(err);
//           if (err) {
//             rejects(err);
//           }
//           resolve(results);
//         }
//       );
//     });

 
//     const rows = await new Promise((resolve, rejects) => {
//       db.query("SELECT * FROM cart WHERE user_id = ?", [id], (err, results) => {
//         if (err) {
//           rejects(err);
//         }
//         resolve(results);
//       });
//     });

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "No Cart Found" });
//     }
//     const cart_id = rows[0].cart_id;

//     const rows1 = await new Promise((resolve, rejects) => {
//       db.query(
//         "SELECT * FROM cart_items WHERE cart_id = ?",
//         [cart_id],
//         (err, results) => {
//           if (err) {
//             rejects(err);
//           }
//           resolve(results);
//         }
//       );
//     });

//     console.log(rows1);

//     // wada
//     if (rows1.length === 0) {
//       return res.status(404).json({ message: "No Cart Items Found" });
//     }

//     for (let item of rows1) {
//       console.log(item.cart_item_id);
//       console.log(item.size_color_quantity_id);
//       console.log(item.quantity);

//       const rows2 = await new Promise((resolve, rejects) => {
//         db.query(
//           "SELECT * FROM size_color_quantity WHERE size_color_quantity_id = ?",
//           [item.size_color_quantity_id],
//           (err, results) => {
//             if (err) {
//               rejects(err);
//             }
//             resolve(results);
//           }
//         );
//       });

//       let availableQuantity = rows2[0].quantity;
//       let product_id =rows2[0].product_id
    



//       if (availableQuantity < item.quantity) {
//         return res
//           .status(400)
//           .json({ message: "Not enough quantity available" });
//       }

//      await new Promise(
//         (resolve,rejects)=>{
//           db.query(
//             "UPDATE product SET sold = sold + ? WHERE p_id = ?",
//             [item.quantity, product_id],
//             (err,result) =>{
//               console.log("Error in code");
//               console.log(err);
//               console.log("result in code");
//               console.log(result);
//               if(err){
//                 rejects(err)
//               }
//               resolve(result)
//             }
//           )
//         }
//       )


//       let newavailableQuantity = availableQuantity - item.quantity;

//       const rows3 = await new Promise((resolve, rejects) => {
//         db.query(
//           "UPDATE size_color_quantity SET quantity = ? WHERE size_color_quantity_id = ?",
//           [newavailableQuantity, item.size_color_quantity_id],
//           (err, results) => {
//             if (err) {
//               rejects(err);
//             }
//             resolve(results);
//           }
//         );
//       });

//       // remove item from cart item table

//       const rows4 = await new Promise((resolve, rejects) => {
//         db.query(
//           "DELETE FROM cart_items WHERE cart_item_id = ?",
//           [item.cart_item_id],
//           (err, results) => {
//             if (err) {
//               rejects(err);
//             }
//             resolve(results);
//           }
//         );
//       });

//       console.log({ rows4: rows4 });

//       console.log(order_rows);

//       console.log(order_rows.insertId);
//       console.log(item.size_color_quantity_id);
//       console.log(item.quantity);
//       // add product to the orders_items table

//       const rows5 = await new Promise((resolve, rejects) => {
//         db.query(
//           "INSERT INTO order_items (order_id, size_color_quantity_id, quantity) VALUES (?,?,?)",
//           [order_rows.insertId, item.size_color_quantity_id, item.quantity],
//           (err, results) => {
//             if (err) {
//               rejects(err);
//             }
//             resolve(results);
//           }
//         );
//       });

//       console.log({ rows5: rows5 });
//       // update quantity in other customers' carts

//       const rows6 = await new Promise((resolve, rejects) => {
//         db.query(
//           "UPDATE cart_items SET quantity = LEAST(quantity, ?) WHERE size_color_quantity_id = ?",
//           [newavailableQuantity, item.size_color_quantity_id],
//           (err, results) => {
//             if (err) {
//               rejects(err);
//             }
//             resolve(results);
//           }
//         );
//       });
//       console.log({ rows6: rows6 });
//     }

//     // await Promise.all(promises);



//     const bodyMessage = `Thank You for Purchased from Nisha Fashion Store. To see the order confirmation details visit this link. <a href='http://localhost:3001/order'>See Orser Details</>`;
//     const data = {
//       to: email,
//       text: `Hi ${firstName} ${lastName}, Order is successful `,
//       subject: "Order Confirmation",
//       htm: bodyMessage,
//     };
//     sendEmail(data);


//     res.status(201).json({ message: "Order created successfully" });
//   } catch (error) {
//     // res.status(404).json(error)
//     throw new Error(error);
//   }
// });

const createOrderCashier = asyncHandler(async (req, res) => {
  const { products } = req.body;
  const { id } = req.user;
  let salesIdForFront;

  try {
    const sales_rows = await new Promise((resolve, rejects) => {
      db.query(
        "INSERT INTO sales (user_id) VALUES (?)",
        [id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    const sales_id = sales_rows.insertId;
    salesIdForFront = sales_id;

    // Insert into sales_items table and update size_color_quantity table
    const promises = products.map(async (product) => {
      const { size_color_quantity_id, quantity } = product;

      // Check available quantity

      const rows = await new Promise((resolve, rejects) => {
        db.query(
          "SELECT quantity FROM size_color_quantity WHERE size_color_quantity_id = ?",
          [size_color_quantity_id],
          (err, results) => {
            if (err) {
              rejects(err);
            }
            resolve(results);
          }
        );
      });

      let availableQuantity = rows[0].quantity;

      if (availableQuantity < quantity) {
        return res
          .status(400)
          .json({ message: "Not enough quantity available" });
      }

      // Update quantity in size_color_quantity table
      let newavailableQuantity = availableQuantity - quantity;

      const rows2 = await new Promise((resolve, rejects) => {
        db.query(
          "UPDATE size_color_quantity SET quantity = ? WHERE size_color_quantity_id = ?",
          [newavailableQuantity, size_color_quantity_id],
          (err, results) => {
            if (err) {
              rejects(err);
            }
            resolve(results);
          }
        );
      });

      // Insert into sales_items table
      const rows3 = await new Promise((resolve, rejects) => {
        db.query(
          "INSERT INTO sales_items (sales_id, size_color_quantity_id, quantity) VALUES (?,?,?)",
          [sales_id, size_color_quantity_id, quantity],
          (err, results) => {
            if (err) {
              rejects(err);
            }
            resolve(results);
          }
        );
      });
    });

    await Promise.all(promises);

    // Commit transaction

    const row4 = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM sales WHERE sales_id = ?",
        [salesIdForFront],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });
    const salesOrder = rows4[0];
    console.log(salesOrder);

    res
      .status(201)
      .json({ message: "Order created successfully", salesOrder: salesOrder });
  } catch (error) {
    throw new Error(error);
  }
});

const printBillCashier = asyncHandler(async (req, res) => {
  try {
    // console.log(req.params.salesOrderId);
    const salesOrderId = req.params.salesOrderId;

    // Fetch order details from the database using the order ID
    const order = await fetchOrderDetails(salesOrderId);
    // Generate the PDF using pdfmake
    console.log(order);

    // const pdfDoc = pdfMake.createPdf(pdfTemplate(order));
    // console.log(pdfDoc)

    res.status(200).send(order);
  } catch (error) {
    throw new Error(error);
  }
});

async function fetchOrderDetails(salesId) {
  const salesRows = await new Promise((resolve, rejects) => {
    db.query(
      "SELECT * FROM sales WHERE sales_id = ?",
      [salesId],
      (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      }
    );
  });

  const sales = salesRows[0];

  const salesItemRows = await new Promise((resolve, rejects) => {
    db.query(
      "SELECT size_color_quantity.*, size.size_name, color.col_name, product.p_title, sales_items.quantity FROM sales_items JOIN size_color_quantity ON sales_items.size_color_quantity_id = size_color_quantity.size_color_quantity_id JOIN size ON size_color_quantity.size_id = size.size_id JOIN color ON size_color_quantity.color_code = color.col_code JOIN product ON size_color_quantity.product_id = product.p_id WHERE sales_items.sales_id = ?",
      [salesId],
      (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      }
    );
  });

  sales.items = salesItemRows.map((row) => {
    return {
      p_title: row.p_title,
      size_name: row.size_name,
      color_name: row.col_name,
      quantity: row.quantity,
      unit_price: row.unit_price,
      full_total_price: row.quantity * row.unit_price,
    };
  });
  // console.log(sales.items);

  sales.total_price = sales.items.reduce((total, item) => {
    return total + item.full_total_price;
  }, 0);

  
  // console.log("anthima");
  // console.log(sales);

  return sales;
}

const getCashierSalesByCashierId = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM sales WHERE user_id = ?",
        [id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    if (rows.length === 0) {
      return res.status(200).json({ message: "No Sales Found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query("SELECT * FROM orders", (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      });
    });
    const orders = rows;

    res.status(200).json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrdersById = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM orders WHERE user_id = ?",
        [id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    if (rows.length === 0) {
      return res.status(200).json({ message: "No Orders Found" });
    }

    const orders = rows;

    res.status(200).json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrderProducts = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderItems = await new Promise((resolve, rejects) => {
      db.query(
        `SELECT oi.*, p.p_title, scq.* ,s.* , c.*, oi.quantity as ordered_quantity, (oi.quantity * scq.unit_price) as total_price
          FROM order_items oi
           LEFT JOIN size_color_quantity scq ON oi.size_color_quantity_id = scq.size_color_quantity_id
           LEFT JOIN product p ON scq.product_id = p.p_id
           LEFT JOIN size s ON scq.size_id = s.size_id
           LEFT JOIN color c ON scq.color_code = c.col_code
           WHERE oi.order_id = ?`,
        [orderId],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    console.log(orderItems);

    const orderItemsWithTotal = orderItems.map((item) => {
      const total = item.unit_price * item.quantity;
      return { ...item, total };
    });
    console.log(orderItemsWithTotal);

    res.status(200).json([orderItemsWithTotal]);
  } catch (error) {
    throw new Error(error);
  }
});

const getAOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM orders WHERE order_id = ?",
      [id]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Order not found" });
    }

    const order = rows[0];

    connection.release();
    res.status(200).json({ order });
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query(
        "UPDATE orders SET order_status = ? WHERE order_id = ?",
        [status, id],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const updateRole = asyncHandler(async (req, res) => {
  const { selectedRole, userId } = req.body;
  console.log(req.body);

  try {
    const updateEnq = await new Promise((resolve, rejects) => {
      db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [selectedRole, userId],
        (err, results) => {
          if (err) {
            rejects(err);
          }
          resolve(results);
        }
      );
    });

    res.status(201).json(updateEnq);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = {
  createUser,
  loginUser,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  forgotPasswordToken,
  forgotPasswordTokenAdmin,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  removeFromCartItem,
  applyCoupon,
  // createOrder,
  getOrders,
  updateOrderStatus,
  loginCashier,
  createOrderCashier,
  printBillCashier,
  getOrderProducts,
  getOrdersById,
  updateRole,
  getCashierSalesByCashierId,
};
