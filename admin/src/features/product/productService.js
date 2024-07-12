import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  const response = await axios.get(`${base_url}product/`);
  // console.log(response)

  return response.data;
};
const createProduct = async (product) => {
  const response = await axios.post(`${base_url}product/`, product, config);

  return response.data;
};
const updateProduct = async (product) => {
  const response = await axios.put(
    `${base_url}product/${product.id}`,
    product.formData,
    config
  );

  return response.data;
}

const deleteProduct = async (product) =>{
  const response = await axios.delete(`${base_url}product/${product}`, config)
  return response.data
}
const getSingleProduct = async (productId) =>{
  const response = await axios.get(`${base_url}product/${productId}`)
  return response.data
}
const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
};

export default productService;
