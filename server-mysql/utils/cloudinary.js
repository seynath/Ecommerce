const cloudinary = require("cloudinary");


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});






const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
        );
    });
  });
};


const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };

    
// const cloudinaryUploadImg = async (file) => {
//   try {
//     const result = await cloudinary.uploader.upload(file.path);
//     return result.secure_url; // Return the secure URL of the uploaded image
//   } catch (error) {
//     throw new Error('Failed to upload image to Cloudinary');
//   }
// };


// const storeImageInDatabase = async (productId, imageUrl) => {
//   try {
//     // Insert the image URL into the database
//     const connection = await pool.getConnection();
//     await connection.execute('INSERT INTO image (image_link, product_id) VALUES (?, ?)', [imageUrl, productId]);
//   } catch (error) {
//     throw new Error('Failed to store image URL in database');
//   }
// };






// const cloudinaryUploadImg = async (fileToUploads) => {
  //   return new Promise((resolve) => {
    //     cloudinary.uploader.upload(fileToUploads, (result) => {
      //       resolve(
    //         {
    //           url: result.secure_url,
    //           asset_id: result.asset_id,
    //           public_id: result.public_id,
    //         },
    //         {
    //           resource_type: "auto",
    //         }
    //       );
    //     });
    //   });
    // };