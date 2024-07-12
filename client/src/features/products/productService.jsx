import axios from 'axios';
import { base_url, config } from '../../utils/axiosConfig';

const getAllProducts = async () => {
  try {
    const response =  await axios.get(`${base_url}product`);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
}

const getSingleProduct = async (productId) => {
  try {
    const response =  await axios.get(`${base_url}product/${productId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
}


const addToWishlist = async (prodId) => {
  try {
    const response =  await axios.put(`${base_url}product/wishlist`, {prodId}, config);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
}

const getWishlist = async () => {
  try {
    const response = await axios.get(`${base_url}user/wishlist`, config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
}

const addToCart = async ( cartData )=>{
  try {
    console.log(cartData);
    const response = await axios.post(`${base_url}user/cart`, cartData, config);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
}

const getCart = async () => {
  try{
    const response = await axios.get(`${base_url}user/cart`, config);
    console.log(response);
    return response.data;
  }
  catch(error){
    return error.response.data.message;
  }
}

const removeFromCartItem = async (cartItemId) => {
  try {
    const response = await axios.delete(`${base_url}user/cart/${cartItemId}`, config);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
}

const addReview = async (reviewData) => {
  try{
    return await axios.post(`${base_url}product/rating`, reviewData, config);
  } catch(error) {
    return error.response.data.message;
  }
}



export const productService = {
  getAllProducts ,
  addToWishlist,
  getWishlist,
  getSingleProduct,
  addToCart,
  getCart,
  removeFromCartItem,
  addReview
};