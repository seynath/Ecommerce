const asyncHandler = require("express-async-handler");
const { db } = require("../config/db");

const createSupplier = asyncHandler(async (req, res) => {
  const {
    supplierName,
    supplierEmail,
    supplierPhone,
    supplierAddress,
    productIds,
  } = req.body;
  console.log(req.body);
  try {


    // Begin transaction

    // Check if supplier already exists

    const checkSupplierQuery = "SELECT * FROM supplier WHERE supplier_name = ?";

    const checkSupplierResult = await new Promise(
      (resolve, reject) => {
        db.query(
          checkSupplierQuery,
          [supplierName],

          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
        )
    

    if (checkSupplierResult.length > 0) {
      // Rollback transaction
   
      return res.status(400).json({ message: "Supplier already exists" });
    }

    // Insert new supplier
    const insertSupplierQuery =
      "INSERT INTO supplier (supplier_name, supplier_email, supplier_phone, supplier_address) VALUES (?, ?, ?, ?)";

    const insertSupplierResult = await new Promise(
      (resolve, reject) => {
        db.query(
          insertSupplierQuery,
          [supplierName, supplierEmail, supplierPhone, supplierAddress],
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


    const newSupplierId = insertSupplierResult.insertId;

    // Insert into supplier_products table to associate supplier with products
    const associateProductsQuery =
      "INSERT INTO supplier_products (product_id, supplier_id) VALUES (?, ?)";
    for (let productId of productIds) {

      await new Promise(
        (resolve, reject) => {
          db.query(
            associateProductsQuery,
            [productId, newSupplierId],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      )
   
    }

    // Commit transaction
  
    return res.status(201).json({
      message: "Supplier created and associated with products",
      supplierId: newSupplierId,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllSuppliers = asyncHandler(async (req, res) => {
  try {

    // Get all suppliers
    const getSuppliersQuery = "SELECT * FROM supplier";

    const suppliersResult = await new Promise(
      (resolve, reject) => {
        db.query(
          getSuppliersQuery,
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    )

    return res.json(suppliersResult);
  } catch (error) {
    throw new Error(error);
  }
});

const updateSupplier = asyncHandler(async (req, res) => {
  const {
    supplierId,
    supplierName,
    supplierEmail,
    supplierPhone,
    supplierAddress,
    productIds,
  } = req.body;

  try {
    const connection = await pool.getConnection();

    // Begin transaction
    await connection.beginTransaction();

    // Check if supplier already exists with the new name
    const checkSupplierQuery =
      "SELECT * FROM supplier WHERE supplier_name = ? AND supplier_id <> ?";
    const [checkSupplierResult] = await connection.execute(checkSupplierQuery, [
      supplierName,
      supplierId,
    ]);

    if (checkSupplierResult.length > 0) {
      // Rollback transaction
      await connection.rollback();
      connection.release();
      return res
        .status(400)
        .json({ message: "Supplier with this name already exists" });
    }

    // Update supplier
    const updateSupplierQuery =
      "UPDATE supplier SET supplier_name = ?, supplier_email = ?, supplier_phone = ?, supplier_address = ? WHERE supplier_id = ?";
    await connection.execute(updateSupplierQuery, [
      supplierName,
      supplierEmail,
      supplierPhone,
      supplierAddress,
      supplierId,
    ]);

    // Delete existing supplier_products associations
    const deleteAssociationsQuery =
      "DELETE FROM supplier_products WHERE supplier_id = ?";
    await connection.execute(deleteAssociationsQuery, [supplierId]);

    // Insert into supplier_products table to associate supplier with products
    const associateProductsQuery =
      "INSERT INTO supplier_products (product_id, supplier_id) VALUES (?, ?)";
    for (let productId of productIds) {
      await connection.execute(associateProductsQuery, [productId, supplierId]);
    }

    // Commit transaction
    await connection.commit();
    connection.release();
    return res.status(200).json({
      message: "Supplier updated and associated with products",
      supplierId: supplierId,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  // console.log(supplierId);

  try {

    const deleteAssociationsQuery =
      "DELETE FROM supplier_products WHERE supplier_id = ?";

      const deletedValue = await new Promise(
        (resolve, reject) => {
          db.query(
            deleteAssociationsQuery,
            [supplierId],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
          )
        
      

    // Delete supplier
    const deleteSupplierQuery = "DELETE FROM supplier WHERE supplier_id = ?";

    await new Promise(
      (resolve, reject) => {
        db.query(
          deleteSupplierQuery,
          [supplierId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }

    )

    return res.status(200).json({ message: "Supplier deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

const getSupplier = asyncHandler(async(req,res)=>{

  const {supplierId} = req.params;

  try {



    const rows = await new Promise(
      (resolve, reject) => {
        db.query(
          "SELECT * FROM supplier WHERE supplier.supplier_id = ?",
          [supplierId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    )
   
    res.status(200).json(rows);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
  })

const getASupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;

  try {

    const getSupplierQuerys = `
    SELECT
    supplier_products.supplier_products_id,
    supplier_products.product_id,
    supplier_products.supplier_id,
    product.p_id,
    product.p_title,
    product.p_slug,
    product.p_description,
    product.brand,
    product.quantity,
    product.price,
    product.sold,
    product.total_rating,
    product.category_id,
    product.created_at,
    supplier.supplier_name,
    supplier.supplier_email,
    supplier.supplier_phone,
    supplier.supplier_address,
    image.image_id,
    image.image_link,
    image.asset_id,
    image.public_id
  FROM
    supplier_products
  LEFT JOIN
    product ON supplier_products.product_id = product.p_id
  LEFT JOIN
    supplier ON supplier_products.supplier_id = supplier.supplier_id
  LEFT JOIN
    image ON product.p_id = image.product_id
  WHERE
    supplier.supplier_id = ?;
      `;


      const supplierResult = await new Promise(
        (resolve, reject) => {
          db.query(
            getSupplierQuerys,
            [supplierId],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      )
  
    // Group the images by the product_id using the reduce function
    const groupedResult = supplierResult.reduce((acc, curr) => {
      const { supplier_products_id, ...rest } = curr;
      if (acc[supplier_products_id]) {
        acc[supplier_products_id].images.push(rest);
      } else {
        acc[supplier_products_id] = { ...rest, images: [rest] };
      }
      return acc;
    }, {});

    // Convert the object into an array
    const finalResult = Object.values(groupedResult);

    return res.status(200).json(finalResult);
  } catch (error) {
    throw new Error(error);
  }
});


const deleteProductFromSupplierByID = asyncHandler(async(req,res) =>{
  const {productId, supplierId} = req.body;
  console.log(supplierId);
  console.log(productId);


  try {
    const deleteProductQuery = "DELETE FROM supplier_products WHERE supplier_id = ? AND product_id = ?";

    await new Promise(
      (resolve, reject) => {
        db.query(
          deleteProductQuery,
          [supplierId, productId],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    )
 
    return res.status(200).json({message: "Product deleted from supplier"});
  } catch (error) {
    throw new Error(error);
  }
})

const updateSupplierByProduct = asyncHandler(async (req,res)=>{


  const {supplier_id, supplier_name, supplier_email, supplier_phone, supplier_address} = req.body.supplierDetails;
  const productIds = req.body.productIds;

  try {
   
    const updateSupplierQuery = "UPDATE supplier SET supplier_name = ?, supplier_email = ?, supplier_phone = ?, supplier_address = ? WHERE supplier_id = ?";
  
    await new Promise(
      (resolve, reject) => {
        db.query(
          updateSupplierQuery,
          [supplier_name, supplier_email, supplier_phone, supplier_address, supplier_id],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    )

    const deleteAssociationsQuery = "DELETE FROM supplier_products WHERE supplier_id = ?";

    await new Promise(
      (resolve, reject) => {
        db.query(
          deleteAssociationsQuery,
          [supplier_id],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      }
    )



    const associateProductsQuery = "INSERT INTO supplier_products (product_id, supplier_id) VALUES (?, ?)";
    for (let productId of productIds) {

      await new Promise(
        (resolve, reject) => {
          db.query(
            associateProductsQuery,
            [productId, supplier_id],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      )
    }

   
    return res.status(200).json({message: "Supplier updated and associated with products"});
  } catch (error) {
    throw new Error(error);
  }
})

const getProductsFromSupplierId = asyncHandler(async (req,res) =>{
  const {supplierId} = req.params;
  try {


    const getProductsQuery = `
    SELECT
    supplier_products.supplier_products_id,
    supplier_products.product_id,
    supplier_products.supplier_id,
    product.p_id,
    product.p_title,
    product.p_slug,
    product.p_description,
    product.brand,
    product.quantity,
    product.price,
    product.sold,
    product.total_rating,
    product.category_id,
    product.created_at,
    supplier.supplier_name,
    supplier.supplier_email,
    supplier.supplier_phone,
    supplier.supplier_address,
    image.image_id,
    image.image_link,
    image.asset_id,
    image.public_id
  FROM
    supplier_products
  LEFT JOIN
    product ON supplier_products.product_id = product.p_id
  LEFT JOIN
    supplier ON supplier_products.supplier_id = supplier.supplier_id
  LEFT JOIN
    image ON product.p_id = image.product_id
  WHERE
    supplier.supplier_id = ?;
      `;

      const productsResult = await new Promise(
        (resolve, reject) => {
          db.query(
            getProductsQuery,
            [supplierId],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      )
    const uniqueProducts = productsResult.reduce((acc, product) => {
      // Find this product in the accumulator array
      const existingProduct = acc.find(p => p.p_id === product.p_id);
    
      if (existingProduct) {
        // If this product is already in the accumulator, add this image to its images array
        existingProduct.images.push({
          image_id: product.image_id,
          image_link: product.image_link,
          asset_id: product.asset_id,
          public_id: product.public_id
        });
      } else {
        // If this product is not in the accumulator, add it to the accumulator
        // Also create an images array for this product
        acc.push({
          ...product,
          images: [{
            image_id: product.image_id,
            image_link: product.image_link,
            asset_id: product.asset_id,
            public_id: product.public_id
          }]
        });
      }
    
      return acc;
    }, []);
    
    return res.status(200).json(uniqueProducts);
  } catch (error) {
    throw new Error(error);
  }
})

const getSupplierbyDetails = asyncHandler(async (req,res) => {
  const {id} = req.params;
  try {

    const rows = await new Promise(
      (resolve, reject) => {
        db.query(
          `
          SELECT 
          s.*,
          sp.product_id
          FROM supplier s
          LEFT JOIN supplier_product sp ON s.supplier_id = sp.supplier_id
          WHERE s.supplier_id = ?
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
      }
    )

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})



module.exports = {
  createSupplier,
  getAllSuppliers,
  getASupplier,
  deleteSupplier,
  deleteProductFromSupplierByID,
  updateSupplierByProduct,
  getProductsFromSupplierId,
  getSupplierbyDetails,
  getSupplier,
};
