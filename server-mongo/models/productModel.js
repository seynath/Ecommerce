const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter product title"],
      trim: true,
      maxLength: [100, "Product title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please enter product slug"],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
      maxLength: [500, "Product description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],

      default: 0.0,
    },
    category: {
      type: String,
      required:true,
    },
    brand: {
      type: String,
      required:true,
    },
    quantity: {
      type: Number,
      required: [true, "Please enter product quantity"],
    },
    sold: {
      type: Number,
      default: 0,
      //select: false, meka dunna gaman ena load ekee eka pennan na
    },
    // images: {
    //   type: Array,
    // },
    // images:[
    //   {
    //     public_id: String,
    //     url: String,
    //   }
    // ],

    images:[],
    color: {
      type: String,
      required:true,
    },
    ratings: [{
      star: Number,
      comment: String,
      postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    }],
    totalrating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
