const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
const { pool, db } = require("../config/db"); // adjust the path according to your project structure
const { error } = require("console");
const { resolve } = require("path");

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { title, description, brand, category, attributes } = req.body;

    const parsedAttributes = JSON.parse(attributes);

    // let lowestPrice = Number.MAX_SAFE_INTEGER;
    // if (parsedAttributes && parsedAttributes.length > 0) {
    //   lowestPrice = Math.min(...parsedAttributes.map(attr => attr.price));
    // }

    let lowestPrice = Infinity;
    if (parsedAttributes && parsedAttributes.length > 0) {
      lowestPrice = Math.min(
        ...parsedAttributes.map((attr) => parseFloat(attr.price))
      );
    }

    const slug = title ? slugify(title) : "";

    // Insert product into the database

    const sql = `INSERT INTO product (p_title, p_slug, p_description, brand, category_id, price) VALUES (?, ?, ?, ?, ?, ?)`;

    const result = await new Promise((resolve, reject) => {
      db.query(
        sql,
        [title, slug, description, brand, category, lowestPrice],
        (error, results) => {
          console.log("result");
          console.log(error);
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    const productId = result.insertId;

    if (parsedAttributes && parsedAttributes.length > 0) {
      parsedAttributes.forEach(async (attribute, index) => {
        console.log(`Attribute ${index + 1}:`);
        console.log(`Size: ${attribute.size}`);
        console.log(`Color: ${attribute.color}`);
        console.log(`Quantity: ${attribute.quantity}`);
        console.log(`Price: ${attribute.price}`);
        console.log(`Buying Price: ${attribute.buyingPrice}`);

        barcodeValue = `${productId}${index}${attribute.size}`;

        console.log(barcodeValue);

        const attributesSql = `INSERT INTO size_color_quantity (product_id, size_id, color_code, quantity, unit_price ,buying_price, barcode) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const resultsAttributes = await new Promise((resolve, reject) => {
          db.query(
            attributesSql,
            [
              productId,
              attribute.size,
              attribute.color,
              attribute.quantity,
              attribute.price,
              attribute.buyingPrice,
              barcodeValue,
            ],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        });

        console.log(resultsAttributes);
      });
    }

    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    // console.log(files);
    for (let i = 0; i < files.length; i++) {
      const { path } = files[i];
      const newPath = await uploader(path);
      urls.push(newPath);

      const imageSql =
        "INSERT INTO image ( image_link, product_id,  asset_id, public_id) VALUES (?, ?, ?, ?)";

      const addedImage = await new Promise((resolve, reject) => {
        db.query(
          imageSql,
          [newPath.url, productId, newPath.asset_id, newPath.public_id],
          (error, results) => {
            console.log("addedIMage");
            console.log(error);
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    }

    res
      .status(200)
      .json({ status: 200, message: "Product created successfully", productId, urls });
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
});


const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { title, description, brand, category, attributes } = req.body;

  console.log(productId);

  // Parse the attributes string into an array of objects
  const parsedAttributes = JSON.parse(attributes);

  // Get the lowest price from the attributes
  let lowestPrice = Infinity;
  if (parsedAttributes && parsedAttributes.length > 0) {
    lowestPrice = Math.min(
      ...parsedAttributes.map((attr) => parseFloat(attr.price))
    );
  }
  const slug = title ? slugify(title) : "";

  // Update the product record in the database
  try {
    const sql = `
    UPDATE product
    SET p_title = ?,
    p_slug = ?,
    p_description = ?,
    brand = ?,
    category_id = ?,
    price = ?
    WHERE p_id = ?
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(
        sql,
        [title, slug, description, brand, category, lowestPrice, productId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    // Update the size_color_quantity records for the product
    if (parsedAttributes && parsedAttributes.length > 0) {
      const insertPromises = parsedAttributes.map(async (attribute, index) => {
        const { size, color, quantity, price, buyingPrice } = attribute;

        const barcodeValue = `${productId}${index}${size}`;

        // Check for existing entry
        const rows = await new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM size_color_quantity WHERE product_id = ? AND size_id = ? AND color_code = ?",
            [productId, size, color],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        });

        if (rows.length > 0) {
          // Update the existing entry
          const updateSql = `UPDATE size_color_quantity SET quantity = ?, unit_price = ?, buying_price = ? WHERE product_id = ? AND size_id = ? AND color_code = ?`;

          const updateSqlResult = await new Promise((resolve, reject) => {
            db.query(
              updateSql,
              [quantity, price, buyingPrice, productId, size, color],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        } else {
          // Insert a new entry
          const insertSql = `
            INSERT INTO size_color_quantity
            (product_id, size_id, color_code, quantity, unit_price, buying_price, barcode)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;

          const insertSqlResult = await new Promise((resolve, reject) => {
            db.query(
              insertSql,
              [
                productId,
                size,
                color,
                quantity,
                price,
                buyingPrice,
                barcodeValue,
              ],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
      });
    }

    // Update the image records for the product
    const deleteImageSql = `DELETE FROM image WHERE product_id = ?`;
    console.log(req.files);


    if (req.files && req.files.length > 0) {
    const deletedImage = await new Promise((resolve, reject) => {
      db.query(deleteImageSql, [productId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    
  }

    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (let i = 0; i < files.length; i++) {
      const { path } = files[i];
      const newPath = await uploader(path);
      urls.push(newPath);

      const imageSql =
        "INSERT INTO image ( image_link, product_id,  asset_id, public_id) VALUES (?, ?, ?, ?)";

      const addedImage = await new Promise((resolve, reject) => {
        db.query(
          imageSql,
          [newPath.url, productId, newPath.asset_id, newPath.public_id],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    }

    res
      .status(200)
      .json({status:200, message: "Product updated successfully", productId, urls });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});


const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Delete the product record from the database
  try {
    const deleteSql = `DELETE FROM product WHERE p_id = ?`;
    const result = await new Promise((resolve, reject) => {
      db.query(deleteSql, [productId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (result.affectedRows === 0) {
      // Product not found, return 404 Not Found
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Delete the associated size_color_quantity records
    const deleteSizeColorQuantitySql = `DELETE FROM size_color_quantity WHERE product_id = ?`;

    const deletedSizeColorQuantity = await new Promise((resolve, reject) => {
      db.query(deleteSizeColorQuantitySql, [productId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Delete the associated image records
    const deleteImageSql = `DELETE FROM image WHERE product_id = ?`;
    const deletedImage = await new Promise((resolve, reject) => {
      db.query(deleteImageSql, [productId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    throw error;
  }
});
// const deleteProduct = asyncHandler(async (req, res) => {
//   const { productId } = req.params;

//   // Delete the product record from the database
//   try {
//     const connection = await pool.getConnection();
//     await connection.beginTransaction();

//     const deleteSql = `DELETE FROM product WHERE p_id = ?`;
//     const [result] = await connection.execute(deleteSql, [productId]);

//     if (result.affectedRows === 0) {
//       // Product not found, return 404 Not Found
//       res.status(404).json({ message: "Product not found" });
//       return;
//     }

//     // Delete the associated size_color_quantity records
//     const deleteSizeColorQuantitySql = `DELETE FROM size_color_quantity WHERE product_id = ?`;
//     await connection.execute(deleteSizeColorQuantitySql, [productId]);

//     // Delete the associated image records
//     const deleteImageSql = `DELETE FROM image WHERE product_id = ?`;
//     await connection.execute(deleteImageSql, [productId]);

//     await connection.commit();

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   } finally {
//     connection.release();
//   }
// });

const getProductCashier = asyncHandler(async (req, res) => {
  const { barcode } = req.params;

  try {
    const rows = await new Promise((resolve, reject) => {
      db.query(
        `
          SELECT 
    p.p_id,
    p.p_title,
    p.brand,
    scq.*,
    i.image_link,
    s.size_name
    FROM product p 
    LEFT JOIN 
    size_color_quantity scq ON p.p_id = scq.product_id
    LEFT JOIN
    image i ON p.p_id = i.product_id
    LEFT JOIN
    size s ON scq.size_id = s.size_id

    WHERE scq.barcode = ?
          `,
        [barcode],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Connect to MySQL database
    // const connection = await pool.getConnection();
    const rows = await new Promise((resolve, reject) => {
      db.query(
        `
          SELECT 
          p.p_id,
          p.p_title,
          p.p_slug,
          p.p_description,
          p.brand,
          p.sold,
          p.price,
          p.total_rating,
          p.category_id,
          c.col_name,
          scq.*,
          i.image_link,
          s.size_name
          FROM product p 
          LEFT JOIN 
          size_color_quantity scq ON p.p_id = scq.product_id
          LEFT JOIN
          image i ON p.p_id = i.product_id
          LEFT JOIN
          size s ON scq.size_id = s.size_id
          LEFT JOIN
          color c ON scq.color_code = c.col_code
      
          WHERE p.p_id = ?
          `,
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    // Execute the SQL SELECT query

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = {
      ...rows[0],
      images: [],
      size_color_quantity: [],
    };

    rows.forEach((row) => {
      // Add images to the product
      if (!product.images.find((img) => img.image_link === row.image_link)) {
        product.images.push({ image_link: row.image_link });
      }

      // Add size_color_quantity to the product
      const scqIndex = product.size_color_quantity.findIndex(
        (scq) => scq.size_color_quantity_id === row.size_color_quantity_id
      );

      if (scqIndex === -1) {
        product.size_color_quantity.push({
          size_color_quantity_id: row.size_color_quantity_id,
          product_id: row.product_id,
          size_id: row.size_id,
          size_name: row.size_name,
          color_code: row.color_code,
          quantity: row.quantity,
          unit_price: row.unit_price,
          buyingPrice: row.buying_price,
          barcode: row.barcode
        });
      }
    });

    // console.log(product);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllProducts = async (req, res) => {
  console.log("begin");
  try {
    // Get a MySQL connection from the pool
    const rows = await new Promise((resolve, reject) => {
      db.query(
        `
          SELECT  
          p.*,
          i.image_id,
          i.image_link,
          cat.cat_name
      
          FROM product p
      
          LEFT JOIN image i ON p.p_id = i.product_id
          LEFT JOIN category cat ON p.category_id = cat.cat_id
          `,
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "No Products Found" });
    }

    // Process the data to group images by product
    const products = rows.reduce((acc, row) => {
      const existingProductIndex = acc.findIndex((p) => p.p_id === row.p_id);

      if (existingProductIndex !== -1) {
        // If the product already exists in the accumulator, add the image to its images array
        acc[existingProductIndex].images.push({
          image_id: row.image_id,
          image_link: row.image_link,
          // Add other image properties here if needed
        });
      } else {
        // If the product doesn't exist in the accumulator, create a new product object with an images array
        acc.push({
          ...row,
          images: [
            {
              image_id: row.image_id,
              image_link: row.image_link,
              // Add other image properties here if needed
            },
          ],
        });
      }

      return acc;
    }, []);
    // console.log(products)

    // Send the processed data in the response
    console.log("end");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getAllProducts = async (req, res) => {
//   console.log("begin");
//   try {
//     // Get a MySQL connection from the pool
//     const connection = await pool.getConnection();

//     sql = `SELECT
//     p.*,
//     i.image_id,
//     i.image_link,
//     cat.cat_name

//     FROM product p

//     LEFT JOIN image i ON p.p_id = i.product_id
//     LEFT JOIN category cat ON p.category_id = cat.cat_id
//      `;

//     // Execute a SELECT query to fetch all users
//     // const [rows] = await connection.execute(
//     //   "SELECT * FROM product LEFT JOIN image ON product.p_id = image.product_id");
//     const [rows] = await connection.execute(sql);
//     // console.log(rows);

//     if (rows.length === 0) {
//       connection.release();
//       return res.status(404).json({ message: "No Products Found" });
//     }

//     // Process the data to group images by product
//     const products = rows.reduce((acc, row) => {
//       const existingProductIndex = acc.findIndex((p) => p.p_id === row.p_id);

//       if (existingProductIndex !== -1) {
//         // If the product already exists in the accumulator, add the image to its images array
//         acc[existingProductIndex].images.push({
//           image_id: row.image_id,
//           image_link: row.image_link,
//           // Add other image properties here if needed
//         });
//       } else {
//         // If the product doesn't exist in the accumulator, create a new product object with an images array
//         acc.push({
//           ...row,
//           images: [
//             {
//               image_id: row.image_id,
//               image_link: row.image_link,
//               // Add other image properties here if needed
//             },
//           ],
//         });
//       }

//       return acc;
//     }, []);
//     // console.log(products)

//     connection.release();

//     // Send the processed data in the response
//     console.log("end");
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const addToWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { prodId } = req.body;

  // const  _id = 13;
  try {
    // Connect to MySQL database

    const existingWishlist = await new Promise(
      (resolve, reject) => {
        db.query(
          "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?",
          [id, prodId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    );
    
    // Check if the user has already added the product to their wishlist

    if (existingWishlist.length > 0) {
      // If the product is already in the wishlist, remove it
      await new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
          [id, prodId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
      );
     

      res.status(200).json({ message: "Product removed from wishlist" });




    } else {
      // If the product is not in the wishlist, add it
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
          [id, prodId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      
      res.status(204).json({ message: "Product added to wishlist" });
    }
  } catch (error) {
    throw new Error(error);
  }
});
// const addToWishlist = asyncHandler(async (req, res) => {
//   const { id } = req.user;
//   const { prodId } = req.body;

//   // const  _id = 13;
//   try {
//     // Connect to MySQL database

//     const existingWishlist = await new Promise(
//       (resolve, reject) => {
//         db.query(
//           "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?",
//           [id, prodId],
//           (error, results) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(results);
//             }
//           }
//         );
//       }
//     );
    
//     // Check if the user has already added the product to their wishlist
//     const [existingWishlist] = await connection.execute(
//       "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?",
//       [id, prodId]
//     );

//     if (existingWishlist.length > 0) {
//       // If the product is already in the wishlist, remove it
//       await connection.execute(
//         "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
//         [id, prodId]
//       );
//       res.json({ message: "Product removed from wishlist" });
//     } else {
//       // If the product is not in the wishlist, add it
//       await connection.execute(
//         "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
//         [id, prodId]
//       );
//       res.status(204).json({ message: "Product added to wishlist" });
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const rating = async (req, res) => {
  const { stars, id, getProductId, review } = req.body;
  try {


    const checkRatingQuery = `
          SELECT *
          FROM ratings
          WHERE user_id = ? AND product_id = ?
      `;

    const ratingRows = await new Promise(
      (resolve, reject) => {
        db.query(
          checkRatingQuery,
          [id, getProductId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    );
    
    const alreadyRated = ratingRows.length > 0;

    if (alreadyRated) {
      const updateRatingQuery = `
              UPDATE ratings
              SET star = ?, comment = ?
              WHERE user_id = ? AND product_id = ?
          `;

      await new Promise(
        (resolve, reject) => {
          db.query(
            updateRatingQuery,
            [stars, review, id, getProductId],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      );

    } else {
      const addRatingQuery = `
              INSERT INTO ratings (user_id, product_id, star, comment)
              VALUES (?, ?, ?, ?)
          `;

      await new Promise(
        (resolve, reject) => {
          db.query(
            addRatingQuery,
            [id, getProductId, stars, review],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      );

    }

    const calculateRatingQuery = `
          SELECT AVG(star) AS total_rating
          FROM ratings
          WHERE product_id = ?
      `;

      const averageRatingRows = await new Promise(
        (resolve, reject) => {
          db.query(
            calculateRatingQuery,
            [getProductId],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      );

    const totalRating = averageRatingRows[0].total_rating;

    const updateTotalRatingQuery = `
          UPDATE product
          SET total_rating = ?
          WHERE p_id = ?
      `;

    await new Promise(
      (resolve, reject) => {
        db.query(
          updateTotalRatingQuery,
          [totalRating, getProductId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    );

    const getProductQuery = `
          SELECT *
          FROM product
          WHERE p_id = ?
      `;

    const productRows = await new Promise(
      (resolve, reject) => {
        db.query(
          getProductQuery,
          [getProductId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    );
  
    const updatedProduct = productRows[0];


    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to rate product" });
  }
};

const getRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.query(
        `  SELECT 
          p.p_id,
          p.p_title,
          p.total_rating,
          r.star,
          r.comment
          FROM product p
          LEFT JOIN ratings r ON p.p_id = r.product_id
          WHERE p.p_id = ?`,
        [id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });


    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// const getRating = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   console.log();
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.execute(
//       `
//       SELECT
//       p.p_id,
//       p.p_title,
//       p.total_rating,
//       r.star,
//       r.comment
//       FROM product p
//       LEFT JOIN ratings r ON p.p_id = r.product_id
//       WHERE p.p_id = ?
//       `,
//       [id]
//     );
//     connection.release();
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const images = urls.map((file) => {
      return file;
    });

    res.json(images);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const getSales = asyncHandler(async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.query(
        // `
        //   SELECT sales.*, sales_items.* ,branches.*
        //   FROM sales 
        //   LEFT JOIN sales_items ON sales.sales_id = sales_items.sales_id
        //   LEFT JOIN branches ON sales.branch_id = branches.branch_id
        //   `,
        `
        SELECT
        s.sales_id,
        s.date_time,
        SUM(si.quantity * scq.unit_price) as total,
        b.branch_name,
        b.branch_id,
        s.user_id as cashier_id,
        JSON_OBJECTAGG(
          CONCAT(scq.size_color_quantity_id),
          JSON_OBJECT(
            'product_id', p.p_id,
            'size_name', sz.size_name,
            'color_name', cl.col_name,
            'quantity', si.quantity,
            'unit_price', scq.unit_price,
            'product_title', p.p_title,
            'product_slug', p.p_slug,
            'product_description', p.p_description,
            'brand', p.brand,
            'image', i.image_link
          )
        ) as items,
        'offline' as order_source
      FROM sales s
      JOIN sales_items si ON s.sales_id = si.sales_id
      JOIN size_color_quantity scq ON si.size_color_quantity_id = scq.size_color_quantity_id
      JOIN size sz ON scq.size_id = sz.size_id
      JOIN color cl ON scq.color_code = cl.col_code
      JOIN product p ON scq.product_id = p.p_id
      JOIN branches b ON s.branch_id = b.branch_id
      JOIN image i ON p.p_id = i.product_id
      GROUP BY s.sales_id, s.date_time`,
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    console.log(rows);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json("naaaaaaaaa");
    // throw new Error(error);
  }
});
// const getSales = asyncHandler(async (req,res) =>{
//   try{
// console.log("aawa");
//     const connection = await pool.getConnection();
//     const [rows] = await connection.execute(
//       `
//       SELECT sales.*, sales_items.* FROM sales LEFT JOIN sales_items ON sales.sales_id = sales_items.sales_id
//       `,
//     );
//     console.log(rows);
//     connection.release();
//     res.status(200).json(rows);
//   } catch(error){
//     res.status(500).json("naaaaaaaaa")
//     // throw new Error(error);
//   }
// })

module.exports = {
  createProduct,
  getProduct,
  getProductCashier,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  deleteImages,
  getRating,
  getSales,
};
