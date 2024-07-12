const asyncHandler = require("express-async-handler");
const { db } = require("../config/db");



// const getOrderChartData = asyncHandler(async (req,res)=>{
//    try{ const query = `
//    SELECT
//              s.sales_id,
//              s.date_time,
//              SUM(si.quantity * scq.unit_price) as total,
//              JSON_OBJECTAGG(
//                CONCAT(scq.size_id, '_', scq.color_code),
//                JSON_OBJECT(
//                  'product_id', p.p_id,
//                  'size_name', sz.size_name,
//                  'color_name', cl.col_name,
//                  'quantity', si.quantity,
//                  'unit_price', scq.unit_price,
//                  'product_title', p.p_title,
//                  'product_slug', p.p_slug,
//                  'product_description', p.p_description,
//                  'brand', p.brand
//                )
//              ) as items
//            FROM sales s
//            JOIN sales_items si ON s.sales_id = si.sales_id
//            JOIN size_color_quantity scq ON si.size_color_quantity_id = scq.size_color_quantity_id
//            JOIN size sz ON scq.size_id = sz.size_id
//            JOIN color cl ON scq.color_code = cl.col_code
//            JOIN product p ON scq.product_id = p.p_id
//            WHERE s.date_time BETWEEN ? AND ?
//            GROUP BY s.sales_id, s.date_time
//    `
   

//    const orderCharts = await new Promise(
//         (resolve,reject)=>{
//             db.query(query,(err,result)=>{
//                 if(err){
//                     reject(err)
//                 }
//                 resolve(result)
//             })
//         }
    
//    )
//     res.status(200).json(orderCharts)

//     }catch(error){
//         res.status(400)
//         throw new Error("Error fetching data")
//     }
// })



const getOrderChartData = asyncHandler(async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Query for sales within the given date range
  
    const sales = await new Promise(
      (resolve, reject) => {
        db.query(
          `
          SELECT
          s.sales_id,
          s.date_time,
          SUM(si.quantity * scq.unit_price) as total,
          JSON_OBJECTAGG(
            CONCAT(scq.size_id, '_', scq.color_code),
            JSON_OBJECT(
              'product_id', p.p_id,
              'size_name', sz.size_name,
              'color_name', cl.col_name,
              'quantity', si.quantity,
              'unit_price', scq.unit_price,
              'product_title', p.p_title,
              'product_slug', p.p_slug,
              'product_description', p.p_description,
              'brand', p.brand
            )
          ) as items
        FROM sales s
        JOIN sales_items si ON s.sales_id = si.sales_id
        JOIN size_color_quantity scq ON si.size_color_quantity_id = scq.size_color_quantity_id
        JOIN size sz ON scq.size_id = sz.size_id
        JOIN color cl ON scq.color_code = cl.col_code
        JOIN product p ON scq.product_id = p.p_id
        WHERE s.date_time BETWEEN ? AND ?
        GROUP BY s.sales_id, s.date_time
          `,
          [fromDate, toDate],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      }
    );
    



    res.status(200).json(sales);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while generating the report" });
  }
});
// const getOrderChartData2 = asyncHandler(async (req, res) => {

//   try {

//     // Query for sales within the given date range
  
//     const sales = await new Promise(
//       (resolve, reject) => {
//         db.query(
//           `
       
// SELECT * FROM orders ORDER BY date_time ASC;


//           `,
//           (err, result) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(result);
//             }
//           }
//         );
//       }
//     );
//     res.status(200).json(sales);
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while generating the report" });
//   }
// });
const getOrderChartData2 = asyncHandler(async (req, res) => {

  try {

    // Query for sales within the given date range
  
    const sales = await new Promise(
      (resolve, reject) => {
        db.query(
          `
       
SELECT DATE_FORMAT(date_time, '%Y-%m-%d %H:%i') AS order_date, COUNT(order_id) AS daily_orders
FROM orders
GROUP BY order_date;

          `,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      }
    );
    res.status(200).json(sales);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while generating the report" });
  }
});



const getDailySalesChart = asyncHandler(async (req,res)=>{


  try{
    const query = `
    SELECT
    DATE_FORMAT(date_time, '%Y-%m-%d') AS date,
    COUNT(sales_id) AS daily_sales
    FROM sales
    GROUP BY date

    `
    const dailySales = await new Promise(
      (resolve,reject)=>{
        db.query(query,(err,result)=>{
          console.log(err);
          if(err){
            reject(err)
          }
          resolve(result)
        })
      }
    )
    res.status(200).json(dailySales)
  }catch(error){
    res.status(400)
    throw new Error("Error fetching data")
  }
})


const getDailySalesGanemulla = asyncHandler(async(req,res)=>{
  try{
    const query = `
    SELECT
    DATE_FORMAT(date_time, '%Y-%m-%d') AS date,
    COUNT(sales_id) AS daily_sales
    FROM sales
    WHERE branch_id = 2
    GROUP BY date
    `
    const dailySales = await new Promise(
      (resolve,reject)=>{
        db.query(query,(err,result)=>{
          if(err){
            reject(err)
          }
          resolve(result)
        })
      }
    )
    res.status(200).json(dailySales)
  }catch(error){
    res.status(400)
    throw new Error("Error fetching data")
  }
})

const getDailySalesGampaha = asyncHandler(async(req,res)=>{
  try{
    const query = `
    SELECT
    DATE_FORMAT(date_time, '%Y-%m-%d') AS date,
    COUNT(sales_id) AS daily_sales
    FROM sales
    WHERE branch_id = 1
    GROUP BY date
    `
    const dailySales = await new Promise(
      (resolve,reject)=>{
        db.query(query,(err,result)=>{
          if(err){
            reject(err)
          }
          resolve(result)
        })
      }
    )
    res.status(200).json(dailySales)
  }catch(error){
    res.status(400)
    throw new Error("Error fetching data")
  }
})

module.exports = { getOrderChartData , getOrderChartData2, getDailySalesChart,
  getDailySalesGanemulla,getDailySalesGampaha
}