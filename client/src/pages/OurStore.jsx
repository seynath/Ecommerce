import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ReactStars from "react-rating-stars-component";
import ProductCard from "../components/ProductCard";
import Color from "../components/Color";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getWishlist } from "../features/products/productSlice";
import axios from "axios";
import { base_url } from "../utils/axiosConfig";

const OurStore = () => {
  const [grid, setGrid] = useState(4);
  // const [productState,setProducts] = useState([]);
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product.product);
  const user = useSelector((state) => state?.auth?.user);
  console.log(productState);

  // const fetchProducts = async () => {

  //     await axios.get(`${base_url}product/`)
  //     .then((res)=>{
  //       console.log(res.data);
  //       setProducts(res.data);
  //     }
  //     ).catch(
  //       (error)=>{
  //         console.log(error);
  //       }
  //     )
  // }

  useEffect(() => {
    getproducts();
    // fetchProducts()
  }, []);

  // const getproducts = () => {
  //   dispatch(getAllProducts())
  // }

  console.log({ productState });

  const [filteredProducts, setFilteredProducts] = useState([]);

  // Define a state to hold the selected filter value
  const [filter, setFilter] = useState("manual");

  useEffect(() => {
    getproducts();
    // ... other code
  }, []);

  const getproducts = () => {
    dispatch(getAllProducts());
  };

  // Use the filter method to filter the products
  useEffect(() => {
    // Use a switch statement to filter the products based on the selected value
    switch (filter) {
      // case 'best-selling':
      //   // This is an example, replace it with your own logic to filter the products based on their sales
      //   const bestSelling = productState.filter(product => product.sold >= 1);
      //   setFilteredProducts(bestSelling);
      //   break;
      case "best-selling":
        // Sort the products based on their sales, from high to low
        const bestSelling = [...productState].sort((a, b) => b.sold - a.sold);
        setFilteredProducts(bestSelling);
        break;

      case "title-ascending":
        const titleAscending = [...productState].sort((a, b) =>
          a.p_title.localeCompare(b.p_title)
        );
        setFilteredProducts(titleAscending);
        break;
      case "title-descending":
        const titleDescending = [...productState].sort((a, b) =>
          b.p_title.localeCompare(a.p_title)
        );
        setFilteredProducts(titleDescending);
        break;
      case "price-ascending":
        const priceAscending = [...productState].sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
        setFilteredProducts(priceAscending);
        break;
      case "price-descending":
        const priceDescending = [...productState].sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
        setFilteredProducts(priceDescending);
        break;
      case "created-ascending":
        const createdAscending = [...productState].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setFilteredProducts(createdAscending);
        break;
      case "created-descending":
        const createdDescending = [...productState].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setFilteredProducts(createdDescending);
        break;
      default:
        setFilteredProducts(productState);
    }
  }, [productState, filter]);

  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <Container class1="store-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="filter-sort-grid mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-10">
                  <p className="mb-0 d-block" style={{ width: "100px" }}>
                    Sort By:
                  </p>
                  <select
                    name=""
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="form-control form-select"
                    id=""
                  >
                    <option value="manula">Featured</option>
                    <option value="best-selling">Best selling</option>
                    <option value="title-ascending">Alphabetically, A-Z</option>
                    <option value="title-descending">
                      Alphabetically, Z-A
                    </option>
                    <option value="price-ascending">Price, low to high</option>
                    <option value="price-descending">Price, high to low</option>
                    <option value="created-ascending">Date, old to new</option>
                    <option value="created-descending">Date, new to old</option>
                  </select>
                </div>
                <div className="d-flex align-items-center gap-10">
                  {/* <p className="totalproducts mb-0">21 Products</p> */}
                  <div className="d-flex gap-10 align-items-center grid">
                    <img
                      onClick={() => {
                        setGrid(3);
                      }}
                      src="images/gr4.svg"
                      className="d-block img-fluid"
                      alt="grid"
                    />
                    <img
                      onClick={() => {
                        setGrid(4);
                      }}
                      src="images/gr3.svg"
                      className="d-block img-fluid"
                      alt="grid"
                    />
                    <img
                      onClick={() => {
                        setGrid(6);
                      }}
                      src="images/gr2.svg"
                      className="d-block img-fluid"
                      alt="grid"
                    />

                    <img
                      onClick={() => {
                        setGrid(12);
                      }}
                      src="images/gr.svg"
                      className="d-block img-fluid"
                      alt="grid"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="products-list pb-5">
              <div className="d-flex gap-10 flex-wrap">
                <ProductCard data={filteredProducts} grid={grid} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default OurStore;
