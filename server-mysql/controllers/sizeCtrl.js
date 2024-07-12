const asyncHandler = require("express-async-handler");
const { pool, db } = require("../config/db");


const createSize = asyncHandler(async (req, res) => {
  const sizeName = req.body.title;

  try {

    const sql = "SELECT * FROM size WHERE size_name = ?";

    const existingSize = await new Promise(
      (resolve, reject) => {
        db.query(
          sql,
          [sizeName],
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
    
    if (existingSize.length > 0) {
      return res.status(400).json({ message: "Size already exists" });
    }

    const insertSizeQuery = "INSERT INTO size (size_name) VALUES (?)";

    const insertResult = await new Promise(
      (resolve, reject) => {
        db.query(
          insertSizeQuery,
          [sizeName],
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
    
 
    const sizeId = insertResult.insertId;
    console.log(sizeId);
    const getSizeQuery = "SELECT * FROM size WHERE size_name = ?";

    const sizeRows =  await new Promise(
      (resolve, reject) => {
        db.query(
          getSizeQuery,
          [sizeName],
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
    
    const newSize = sizeRows[0];

    return res.status(200).json(newSize);

  } catch (error) {
    throw new Error(error);
  }
});

const getallSize  = asyncHandler ( async (req,res) =>{

  try{


    const sql = "SELECT * FROM size";
    const sizes = await new Promise(
      (resolve, reject) => {
        db.query(
          sql,
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
    res.status(200).json(sizes);
  }
  catch(err){
    throw new Error(err)
  }
})

const updateSize = asyncHandler(
  async (req, res) => {
    console.log("id,size");
    const {id,size} = req.body;
  
    try {
      const updateSizeQuery = "UPDATE size SET size_name = ? WHERE size_id = ?";
  
      const updatedSize = await new Promise(
        (resolve, reject) => {
          db.query(
            updateSizeQuery,
            [size, id],
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
  
      if (updatedSize.affectedRows === 0) {
        res.status(400);
        throw new Error("Size not updated");
      }
  
      res.status(201).json(updatedSize);
    } catch (error) {
      throw new Error(error);
    }
  }
);



const deleteSize = asyncHandler(async(req,res)=>{
  const { id } = req.params;
  console.log(id);
  try {
    const deleteSizeSQL = 'DELETE FROM size WHERE size_id = ?';

    const deletedSize = await new Promise(
      (resolve, reject) => {
        db.query(
          deleteSizeSQL,
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
    
    if(deletedSize.length === 0){
      res.status(400);
      throw new Error('Size not deleted');
    }

    res.status(201).json(deletedSize);
  } catch (error) {
    throw new Error(error);
  }
})

const getSize = asyncHandler(async (req,res)=>{
  const { id } = req.params;
  try{
    const sql = "SELECT * FROM size WHERE size_id = ?";
    const size = await new Promise(
      (resolve, reject) => {
        db.query(
          sql,
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
    );
    res.status(200).json(size);
  }
  catch(err){
    throw new Error(err)
  }
})




module.exports = {
  createSize,
  getallSize,
  deleteSize,
  updateSize,
  getSize
  };