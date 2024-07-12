import React, { useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";
import prodcompare from "../assets/prodcompare.svg";
import wish from "../assets/wishlist.svg";
import wishlist from "../assets/wishlist.svg";
import watch from "../assets/watch.jpg";
import watch2 from "../assets/blog-1.jpg";
import { FaHeart } from "react-icons/fa";
// import watch2 from "../images/watch.jpg";
import addcart from "../assets/add-cart.svg";
import view from "../assets/view.svg";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import { useSelector } from "react-redux";
import { getWishlist } from "../features/products/productSlice";

const ProductCard = (props) => {
  const { data, grid } = props;
  const dispatch = useDispatch();

  let location = useLocation();
  const user = useSelector((state) => state?.auth?.user);
  const wishlistState = useSelector((state) => state?.product?.getWishlist);


  useEffect(() => {
    if (user && user.id) {
      dispatch(getWishlist(user.id));
    }
  }, [dispatch]);

  console.log({ wishlistState });

  const addWishlist = (productId) => {
    dispatch(addToWishlist(productId));
    setTimeout(() => {
      dispatch(getWishlist(user.id));
    }, 500);
  };

  const wishlistProductIds = Array.isArray(wishlistState)
    ? wishlistState.map((item) => item.product_id)
    : [];

  return (
    <>
      {Array.isArray(data) ?(
        data &&
        data?.map((product, index) => {
          return (
            <div
              key={index}
              className={` ${
                location.pathname === "/product" ? `gr-${grid}` : "col-3"
              } `}
            >
              <div className="product-card position-relative">
                <div className="wishlist-icon position-absolute">

                  {
                    user && 
                  <button
                    className="border-0 bg-transparent"
                    onClick={(e) => {
                      addWishlist(product?.p_id);
                    }}
                  >
                    {/* <img src={wish} alt="wishlist" /> */}
                    <FaHeart
                      // color={wishlistState?.includes(product?.p_id) ? "blue" : "red"}
                      color={
                        wishlistProductIds.includes(product?.p_id)
                          ? "red"
                          : "gray"
                      }
                      // color={wishlistState.product_id.includes(product?.p_id) ? "red" : "blue"}
                    />
                  </button>
                  }
                </div>
                {/* <div className="action-bar position-absolute">
                  <div className="d-flex flex-column gap-15">
                    <button className="border-0 bg-transparent">
                      <img src={prodcompare} alt="compare" />
                    </button>
                    <button className="border-0 bg-transparent">
                      <img src={view} alt="view" />
                    </button>
                    <button className="border-0 bg-transparent">
                      <img src={addcart} alt="addcart" />
                    </button>
                  </div>
                </div> */}

                <Link to={`/product/${product?.p_id}`}>
                  <div className="product-image" >
                    <img
                      src={product?.image_link}
                      className="img-fluid img-thumbnail"
                      
                      alt="product_image"
                    />
                    <img
                      src={product?.images[1]?.image_link}
                      className="img-fluid"
                      alt="product_image"
                    />
                  </div>
                  <div className="product-details">
                    <h6 className="brand">{}</h6>
                    <h5 className="product-title">{product?.p_title}</h5>
                    <ReactStars
                      count={5}
                      size={24}
                      // value={product?.total_rating.toString()}
                      value={Number(product?.total_rating)}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <p
                      className={`description ${
                        grid === 12 ? "d-block" : "d-none"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: product?.p_description,
                      }}
                    ></p>
                    <p className="price">Rs {product?.price}</p>
                  </div>
                </Link>
              </div>
            </div>
          );
        })
      ) : (
        <div>No Products</div>
      )}


    </>
  );
};

export default ProductCard;






// import React, { useEffect } from "react";
// import ReactStars from "react-rating-stars-component";
// import { Link, useLocation } from "react-router-dom";
// import prodcompare from "../images/prodcompare.svg";
// import wish from "../images/wishlist.svg";
// import wishlist from "../images/wishlist.svg";
// import watch from "../images/watch.jpg";
// import watch2 from "../images/blog-1.jpg";
// import { FaHeart } from "react-icons/fa";
// // import watch2 from "../images/watch.jpg";
// import addcart from "../images/add-cart.svg";
// import view from "../images/view.svg";
// import { useDispatch } from "react-redux";
// import { addToWishlist } from "../features/products/productSlice";
// import { useSelector } from "react-redux";
// import { getWishlist } from "../features/products/productSlice";

// const ProductCard = (props) => {
//   const { data, grid } = props;
//   const dispatch = useDispatch();

//   let location = useLocation();
//   const user = useSelector((state) => state?.auth?.user);
//   const wishlistState = useSelector((state) => state?.product?.getWishlist);

//   useEffect(() => {
//     if (user && user.id) {
//       dispatch(getWishlist(user.id));
//     }
//   }, [dispatch]);

//   console.log({ wishlistState });

//   const addWishlist = (productId) => {
//     dispatch(addToWishlist(productId));
//     setTimeout(() => {
//       dispatch(getWishlist(user.id));
//     }, 500);
//   };

//   const wishlistProductIds = Array.isArray(wishlistState)
//     ? wishlistState.map((item) => item.product_id)
//     : [];

//   return (
//     <>
//       {Array.isArray(data) ? (
//         data &&
//         data?.map((product, index) => {
//           return (
//             <div
//               key={index}
//               style={{ minHeight: "460px" }}
//               className={` ${
//                 location.pathname === "/product" ? `gr-${grid}` : "col-3"
//               } `}
//             >
//               <div
//                 className="product-card position-relative"
//                 style={{ minHeight: "450px" }}
//               >
//                 <div className="wishlist-icon position-absolute">
//                   {user && (
//                     <button
//                       className="border-0 bg-transparent"
//                       onClick={(e) => {
//                         addWishlist(product?.p_id);
//                       }}
//                     >
//                       {/* <img src={wish} alt="wishlist" /> */}
//                       <FaHeart
//                         // color={wishlistState?.includes(product?.p_id) ? "blue" : "red"}
//                         color={
//                           wishlistProductIds.includes(product?.p_id)
//                             ? "red"
//                             : "gray"
//                         }
//                       />
//                     </button>
//                   )}
//                 </div>

//                 <Link
//                   to={`/product/${product?.p_id}`}
//                   style={{ backgroundColor: "blue", minHeight: "400px" }}
//                 >
//                   <div
//                     className=" "
//                     // style={{maxHeight:"500px"}}
//                   >
//                     <img
//                       src={product?.image_link}
//                       className=""
//                       width={400}
//                       height={400}
//                       alt="product_image"
//                       style={{minWidth:"500px"}}
//                     />
                   
//                   </div>

//                   <div
//                     className="product-details d-flex flex-column "
//                     style={{ backgroundColor: "green" }}
//                   >
//                     <h6 className="brand">{}</h6>
//                     <h5 className="product-title">{product?.p_title}</h5>
//                     <ReactStars
//                       count={5}
//                       size={24}
//                       // value={product?.total_rating.toString()}
//                       value={Number(product?.total_rating)}
//                       edit={false}
//                       activeColor="#ffd700"
//                     />
//                     <p
//                       className={`description ${
//                         grid === 12 ? "d-block" : "d-none"
//                       }`}
//                       dangerouslySetInnerHTML={{
//                         __html: product?.p_description,
//                       }}
//                     ></p>
//                     <p className="price">Rs {product?.price}</p>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           );
//         })
//       ) : (
//         <div>No Products</div>
//       )}
//     </>
//   );
// };

// export default ProductCard;
