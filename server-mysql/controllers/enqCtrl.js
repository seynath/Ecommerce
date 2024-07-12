const asyncHandler = require("express-async-handler");
const {db} = require("../config/db")


const createEnquiry = asyncHandler(async (req, res) => {
  console.log(req.body);

  try {
    const {enquiry, orderId} = req.body;


    const createEnquirySQL = `INSERT INTO enquiry (order_id,message) VALUES (?, ?)`;

    const enquiryList = await new Promise(
      (resolve, reject) => {
        db.query(
          createEnquirySQL,
          [orderId, enquiry],
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
    
    if (enquiryList.length === 0) {
      res.status(400);
      throw new Error('Enquiry not created');
    }

    res.status(201).json(enquiryList);
  } catch(error) {
    res.status(500).json({ message: "Error creating enquiry" });
  } 
});





const changeEnquiryStatus = asyncHandler (async (req,res)=>{

  const {id, enqData} = req.body;

  try {
    const updateEnqSQL = 'UPDATE enquiry SET enquiry_status = ? WHERE enquiry_id = ?';

    const updateEnq = await new Promise(
      (resolve, reject) => {
        db.query(
          updateEnqSQL,
          [enqData, id],
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
   
    res.status(201).json(updateEnq);
  } catch (error) {
    
    res.status(401).json({ message: error.message });
  }})
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {

    const deleteEnqSQL = 'DELETE FROM enquiry WHERE enquiry_id = ?';

    const deletedEnquiry = await new Promise(
      (resolve, reject) => {
        db.query(
          deleteEnqSQL,
          [id],
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
    
    if(deletedEnquiry.length === 0){
      res.status(400);
      throw new Error('Enquiry not deleted');
    }

    res.status(201).json(deletedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const getallEnquiry = asyncHandler(async (req, res) => {
  try {
    const getAllEnqSQL = `SELECT enquiry.* , orders.*,enquiry.message as enquiry_message
    FROM enquiry
    LEFT JOIN orders ON enquiry.order_id = orders.order_id
    
    
    `;

    const getaEnquiry = await new Promise(
      (resolve, reject) => {
        db.query(
          getAllEnqSQL,
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
    
    res.json(getaEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});


const getEnquiry = asyncHandler(async (req, res) => {
  const {orderId} = req.params;
  try {

    const getAllEnqSQL = 'SELECT * FROM enquiry WHERE order_id = ?';

    const getallEnquiry = await new Promise(
      (resolve, reject) => {
        db.query(
          getAllEnqSQL,
          [orderId],
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
    
    res.status(200).json(getallEnquiry);
  
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
});
module.exports = {
  createEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
  changeEnquiryStatus
};
