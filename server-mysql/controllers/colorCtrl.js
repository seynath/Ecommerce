const asyncHandler = require("express-async-handler");
const { db } = require("../config/db");


const createColor = asyncHandler(async (req, res) => {
  const colorName = req.body.title;
  const colorCode = req.body.code;

  try {


    const sql = "SELECT * FROM color WHERE col_code = ?";
    const existingColor = await new Promise(
      (resolve, reject) => {
        db.query(
          sql,
          [colorCode],
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
    

    if (existingColor.length > 0) {
      return res.status(400).json({ message: "Color code already exists" });
    }

    const insertColorQuery = "INSERT INTO color (col_code, col_name) VALUES (?, ?)";

    const insertResult = await new Promise(
      (resolve, reject) => {
        db.query(
          insertColorQuery,
          [colorCode, colorName],
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

   
    const colorId = insertResult.insertId;
    console.log(colorId);
    const getColorQuery = "SELECT * FROM color WHERE col_code = ?";

    const colorRows =  await new Promise(
      (resolve, reject) => {
        db.query(
          getColorQuery,
          [colorCode],
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
    const newColor = colorRows[0];

    return res.status(200).json(newColor);

  } catch (error) {
    throw new Error(error);
  }
});


const updateColor = asyncHandler(async (req, res) => {

  const { col_code, col_name } = req.body;
  try {
 
    
    const sql = "UPDATE color SET col_name = ? WHERE col_code = ?";
    const updatedColor = await new Promise(
      (resolve, reject) => {
        db.query(
          sql,
          [col_name, col_code],
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
    res.status(201).json(updatedColor);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    res.json(deletedColor);
  } catch (error) {
    throw new Error(error);
  }
});

const getColor = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let code = "#" + id
  try {

    const sql = "SELECT * FROM color WHERE col_code = ?";
    const getaColor = await new Promise(
      (resolve, reject) => {

        db.query(
          sql,
          [code],
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
    res.status(200).json(getaColor);
  } catch (error) {
    throw new Error(error);
  }
});

const getallColor = asyncHandler(async (req, res) => {
  try {
    const sql = "SELECT * FROM color";

    const colors = await new Promise(
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
    );
    
    res.status(200).json(colors);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
};
