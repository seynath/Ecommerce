import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
// import customerReducer from "../features/cutomers/customerSlice";
import productReducer from "../features/product/productSlice";
import sizeReducer from "../features/size/sizeSlice";
import pCategoryReducer from "../features/pcategory/pcategorySlice";

import colorReducer from "../features/color/colorSlice";

import couponReducer from "../features/coupon/couponSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // customer: customerReducer,
    product: productReducer,
    size: sizeReducer,
    pCategory: pCategoryReducer,

    color: colorReducer,

    coupon: couponReducer,
  },
});