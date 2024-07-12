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

const createOrderCashier = asyncHandler(async (req, res) => {
  const { products, branch } = req.body;
  const { id } = req.user;
  let salesIdForFront;

  try {
    const sales_rows = await new Promise((resolve, rejects) => {
      db.query(
        "INSERT INTO sales (user_id, branch_id) VALUES (?,?)",
        [id, branch],
        (err, results) => {
          console.log(err);
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

    for (let product of products) {
      const { size_color_quantity_id, quantity } = product;

      // Check available quantity
      const rows = await new Promise((resolve, rejects) => {
        db.query(
          "SELECT * FROM size_color_quantity WHERE size_color_quantity_id = ?",
          [size_color_quantity_id],
          (err, results) => {
            console.log({ rows: err });
            if (err) {
              rejects(err);
            }
            resolve(results);
          }
        );
      });
      console.log(rows);

      let availableQuantity = rows[0].quantity;
      //total amount
      let totalAmount = rows[0].unit_price * quantity;

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
              console.log({ rows2: err });
              rejects(err);
            }
            resolve(results);
          }
        );
      });

      // Insert into sales_items table
      const rows3 = await new Promise((resolve, rejects) => {
        db.query(
          "INSERT INTO sales_items (sales_id, size_color_quantity_id, quantity, total_amount) VALUES (?,?,?,?)",
          [sales_id, size_color_quantity_id, quantity, totalAmount],
          (err, results) => {
            console.log({ rows3: err });
            console.log({ rows4: err });
            if (err) {
              rejects(err);
            }
            resolve(results);
          }
        );
      });
    }

    const rows4 = await new Promise((resolve, rejects) => {
      db.query(
        "SELECT * FROM sales WHERE sales_id = ?",
        [salesIdForFront],
        (err, results) => {
          console.log({ rows4: err });
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
      .json({ message: "Order created successfully", sales_id: salesOrder });
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
        `SELECT * 
        FROM sales
        WHERE user_id = ?

        `,
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

const getBranches = asyncHandler(async (req, res) => {
  try {
    const rows = await new Promise((resolve, rejects) => {
      db.query("SELECT * FROM branches", (err, results) => {
        if (err) {
          rejects(err);
        }
        resolve(results);
      });
    });
    res.status(200).json(rows);
  } catch (error) {
    throw new Error(error);
  }
});


const getProductsBySalesId = asyncHandler(async(req,res)=>{
  const {salesId} = req.params;
  try{
    let rows = await new Promise((resolve,rejects)=>{
      db.query(
        `SELECT size_color_quantity.*, size.size_name, color.col_name, product.p_title, sales_items.quantity , image.image_link
        FROM sales_items 
        JOIN size_color_quantity ON sales_items.size_color_quantity_id = size_color_quantity.size_color_quantity_id 
        JOIN size ON size_color_quantity.size_id = size.size_id 
        JOIN color ON size_color_quantity.color_code = color.col_code 
        JOIN product ON size_color_quantity.product_id = product.p_id 
        JOIN image ON product.p_id = image.product_id
        WHERE sales_items.sales_id = ?

        `,
        [salesId],
        (err,results)=>{
          if(err){
            rejects(err);
          }
          resolve(results);
        }
      )
    })

    // Use reduce to group products by their id and push all images of the same product into an array
    rows = rows.reduce((acc, row) => {
      const existingProduct = acc.find(product => product.size_color_quantity_id === row.size_color_quantity_id);
      if (existingProduct) {
        existingProduct.image_links.push(row.image_link);
      } else {
        row.image_links = [row.image_link];
        delete row.image_link;
        acc.push(row);
      }
      return acc;
    }, []);

    res.status(200).json(rows);
  }catch(error){
    throw new Error(error);
  }
})

// const getProductsBySalesId = asyncHandler(async(req,res)=>{
//   const {salesId} = req.params;
//   try{
//     const rows = await new Promise((resolve,rejects)=>{
//       db.query(
//         `SELECT size_color_quantity.*, size.size_name, color.col_name, product.p_title, sales_items.quantity , image.image_link
//         FROM sales_items 
//         JOIN size_color_quantity ON sales_items.size_color_quantity_id = size_color_quantity.size_color_quantity_id 
//         JOIN size ON size_color_quantity.size_id = size.size_id 
//         JOIN color ON size_color_quantity.color_code = color.col_code 
//         JOIN product ON size_color_quantity.product_id = product.p_id 
//         JOIN image ON product.p_id = image.product_id
//         WHERE sales_items.sales_id = ?

//         `,
//         [salesId],
//         (err,results)=>{
//           if(err){
//             rejects(err);
//           }
//           resolve(results);
//         }
//       )
//     })
//     res.status(200).json(rows);
//   }catch(error){
//     throw new Error(error);
//   }
// })

module.exports = {
  createOrderCashier,
  printBillCashier,
  getCashierSalesByCashierId,
  getBranches,
  getProductsBySalesId
};
