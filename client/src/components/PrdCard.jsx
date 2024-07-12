import React, { useEffect, useCallback } from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";
import prodcompare from "../assets/prodcompare.svg";
import { FaHeart } from "react-icons/fa";
import addcart from "../assets/add-cart.svg";
import view from "../assets/view.svg";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import { useSelector } from "react-redux";
import { getWishlist } from "../features/products/productSlice";

const PrdCard = (props) => {
  // const { product} = props;
  const {data, addToWishlist} = props;
  console.log("Hi");

  const dispatch = useDispatch();

  const user = useSelector((state) => state?.auth?.user);

  let location = useLocation();

  useEffect(() => {
    if (user && user.id) {
      dispatch(getWishlist(user.id));
    }
  }, [dispatch]);

  const wishlistState = useSelector((state) => state?.product?.getWishlist);
  // console.log({ wishlistState });

  // const addWishlist = useCallback(() => {
  //   dispatch(addToWishlist(data?.p_id));
  //   dispatch(getWishlist(user.id));
  // }, [dispatch, data?.p_id, user.id]);

  // const addWishlist = (productId) => {
  //   dispatch(addToWishlist(productId));
  //   dispatch(getWishlist(user.id))
  //   // setTimeout(() => {
  //   //   dispatch(getWishlist(user.id));
  //   // }, 500);
      
  // };

  const wishlistProductIds = wishlistState?.map((item) => item?.product_id);

  return (
    <div
      className={` ${
        location.pathname === "/product" ? "gr-3" : "col-3"
      } `}
    >
      
      <div
        className="product-card position-relative "
        style={{minWidth: "200px"}}
      >
        <div className="wishlist-icon position-absolute">
          <button
            className="border-0 bg-transparent"
        
            onClick={() => addToWishlist(data?.p_id)}
          >
            <FaHeart
            className="z-3"
              color={
                wishlistProductIds.includes(data?.p_id) ? "red" : "gray"
              }
            />
          </button>
          </div>
          <Link 
                  to={`/product/${data?.p_id}`}>
                    
        <div className="product-image">
          <img
            src={data?.image_link}
            className="img-fluid"
            alt="product_image"
          />
          <img
            src={data?.images[1]?.image_link}
            className="img-fluid"
            alt="product_image"
          />
        </div>
        <div className="product-details">
          <h6 className="brand">{}</h6>
          <h5 className="product-title">{data?.p_title}</h5>
          <ReactStars
            count={5}
            size={24}
            // value={product?.total_rating.toString()}
            value={Number(data?.total_rating)}
            edit={false}
            activeColor="#ffd700"
          />
          <p
            className={"description d-block"}
            dangerouslySetInnerHTML={{ __html: data?.p_description }}
          ></p>
          <p className="price">Rs {data?.price}</p>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default PrdCard;
