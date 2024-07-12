import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import compare from "../assets/compare.svg";
import wishlistIcon from "../assets/wishlist.svg";
import userIcon from "../assets/user.svg";
import cartIcon from "../assets/cart.svg";
import menu from "../assets/menu.svg";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts, getCart, getWishlist } from "../features/products/productSlice";
import axios from "axios";
import { CiShoppingCart } from "react-icons/ci";
import { base_url } from "../utils/axiosConfig";
import { FaRegHeart } from "react-icons/fa";
import NF from '../assets/NF.png'
import { CiSearch } from "react-icons/ci";
import { FaBars } from "react-icons/fa";


const Header = () => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const products = useSelector((state) => state.product.product);
  console.log(products);

  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      const filtered = products?.filter((product) =>
        product.p_title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const user = useSelector((state) => state.auth.user);

  const cartState = useSelector((state) => state?.product?.cart) || [];
  const wishlistState =
    useSelector((state) => state?.product?.getWishlist) || [];

  const [totalCart, setTotalCart] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        dispatch(getAllProducts())
        await dispatch(getCart());
        await dispatch(getWishlist());
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${base_url}category/`);
        // Do something with response
        console.log(response.data);
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (cartState && cartState?.length > 0) {
      let totPrice = 0;
      for (let i = 0; i < cartState?.length; i++) {
        totPrice += Number(cartState[i]?.product_total);
      }
      setTotalCart(totPrice);
    }
  }, [cartState]);

  let cartLength = 0;
  if (cartState && Array.isArray(cartState)) {
    cartLength = cartState.length;
  }

  const navigateToProduct = (id) => {
    console.log(id);

    navigate(`/product/${id}`);

    setFilteredProducts([])
    setSearch('')
    // window.location.href = `/product/${id}`;
  }

  return (
    <>
      <header className="header-top-strip py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-6">
              <p className="text-white mb-0">
                Free Shipping & Free Returns
              </p>
            </div>
            <div className="col-6">
              <p className="text-end text-white mb-0">
                Hotline:
                <a className="text-white" href="tel:+91 8264954234">
                  +78 606 8119
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>
      <header className="header-upper py-3 pt-4">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-3">
              <div>
                <Link to={"/"} className="text-white">
                <img src={NF} width={70} height={70} />
                </Link>
              </div>
            </div>
            <div className="col-4">
              <div className="input-group"
              style={{backgroundColor:"white", borderRadius:"20px"}}
              
              >
                <input
                  type="text"
                  className="form-control py-1"
                  style={{borderRadius:"20px"}}
                  placeholder="Search Product Here..."
                  aria-label="Search Product Here..."
                  aria-describedby="basic-addon2"
                  value={search}
                  onChange={handleSearchChange}
                />
                

                <span className=" p-3" id="basic-addon2">
                <CiSearch size={30} />
                  {/* <BsSearch className="fs-7" /> */}
                </span>
              </div>
              <div>
              {filteredProducts.length > 0 && (
                  <div className="dropdown-menu show">
                    {filteredProducts.map((product, index) => (
                      <div key={index} className="dropdown-item" onClick={()=>{navigateToProduct(product.p_id)}}>
                        <img alt="prd" src={product.image_link} width={50} height={50}/>
                        {product.p_title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col-5">
              <div className="header-upper-links d-flex align-items-center gap-3 justify-content-end">
                <div>
                  {!user ? (
                    <Link
                      to="/login"
                      className="d-flex align-items-center gap-10 text-white"
                    >
                      <img src={wishlistIcon} alt="wishlist" />
                    </Link>
                  ) : (
                    <Link
                      to="/wishlist"
                      className="d-flex align-items-center gap-10 text-white"
                    >
                      <img src={wishlistIcon} alt="wishlist" />
                      {/* <span className="badge bg-white text-dark">
                        {wishlistState.length}
                      </span> */}
                    </Link>
                  )}

                  {/* Login */}
                </div>
                <div>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={userIcon} alt="user" />
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {user !== null ? (
                        <>
                          <li>
                            <Link
                              className="dropdown-item  text-dark"
                              to="/profile"
                            >
                              My Account
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/order"
                              className=" dropdown-item  align-items-center text-dark"
                            >
                              My Orders
                            </Link>
                          </li>
                          <li>
                            <button
                              to="/logout"
                              className=" dropdown-item  align-items-center text-dark "
                              onClick={() => {
                                // Remove the user and tokens from local storage
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");

                                // Refresh the page
                                window.location.reload();
                              }}
                            >
                              Log Out
                            </button>
                          </li>
                        </>
                      ) : (
                        <li>
                          <Link
                            to="/login"
                            className=" dropdown-item  align-items-center text-dark"
                          >
                            {/* <p className="mb-0">
                      Log in <br /> My Account
                    </p> */}
                            Login
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Cart */}
                <div>
                  {!user ? (
                    <Link
                      to="/login"
                      className="d-flex align-items-center gap-10 text-white"
                    >
                      {/* <img src={cartIcon} alt="cart" /> */}
                      <CiShoppingCart  size={35}/>
                      {/* <div className="d-flex flex-column gap-10">
                        <span className="badge bg-white text-dark">0</span>
                        <p className="mb-0">Rs 500</p>
                      </div> */}
                    </Link>
                  ) : (
                    <Link
                      to="/cart"
                      className="d-flex align-items-center gap-10 text-white"
                    >
                      <CiShoppingCart  size={35}/>
                      {/* <img src={cartIcon} alt="cart" /> */}
                      <div className="d-flex flex-column gap-10">
                        <span className="badge bg-white text-dark" >
                          {cartLength}
                        </span>
                        <p className="mb-0">
                          Rs {Number(isNaN(totalCart) ? 0 : totalCart)}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <header className="header-bottom py-3" style={{borderTopColor:"white", border:"1px solid white"}}> */}
      <header className="header-bottom py-3" style={{borderTop:"1px solid white", borderBottom:"2px solid white"}}>
        <div className="container-xxl" >
          <div className="row" >
            <div className="col-12" >
              <div className="menu-bottom d-flex align-items-center gap-30">
                <div>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {/* <img src={menu} alt="" /> */}
                      <FaBars  size={15}/>
                      <span className="me-5 d-inline-block">
                        Shop Categories
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {categories.length !== 0 &&
                        categories.map((category, index) => (
                          <li key={index}>
                            <Link
                              className="dropdown-item text-white"
                              to={`/category/${category.cat_id}`}
                            >
                              {category.cat_name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                
                  </div>
                </div>
                <div className="menu-links w-100 ">
                  <div className="d-flex align-items-center gap-15 " style={{marginInlineStart:"300px"}}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/product">Our Store</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;