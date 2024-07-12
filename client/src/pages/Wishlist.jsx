import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch } from "react-redux";
import { getAllProducts, getWishlist, addToWishlist } from "../features/products/productSlice";
import { useSelector } from "react-redux";
import { useEffect , useMemo, useCallback} from "react";
import PrdCard from "../components/PrdCard";

const Wishlist = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  
  // useEffect(() => {
  //   if (user) {
  //     dispatch(getAllProducts());
  //     setTimeout(()=>{
  //       dispatch(getWishlist(user?.id));
  //     },500)
  //   }
  // }, []);

  // useEffect(async () => {
  //   if (user) {
  //     await dispatch(getAllProducts());
  //     setTimeout(()=>{
  //             dispatch(getWishlist(user?.id));
  //           },500)
  //   }
  // }, [user]); // add user as a dependency
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await dispatch(getAllProducts());
        await dispatch(getWishlist(user?.id));
       
      }
    };
  
    fetchData();
  }, [user]); // add user as a dependency


  const products = useSelector((state) => state?.product?.product) || [];
  const wishlistState = useSelector((state) => state?.product?.getWishlist) || [];
  
  console.log({ wishlistState });
  console.log({ products });

  // const wishlistProductIds = wishlistState?.map((item) => item?.product_id);
  // console.log({ wishlistProductIds });
  const wishlistProductIds = (wishlistState || []).map((item) => item?.product_id);
console.log({ wishlistProductIds });

  // const wishlistProducts = products.filter(product => wishlistProductIds.includes(product.p_id));
  // const wishlistProducts = wishlistProductIds
  //   ? products.filter((product) => wishlistProductIds.includes(product.p_id))
  //   : [];
  // console.log({ wishlistProducts });
  const wishlistProducts = useMemo(() => {
    return wishlistProductIds ? products?.filter((product) => wishlistProductIds.includes(product.p_id))
      : [];
  }, [products, wishlistProductIds]);

  const addWishlist = useCallback((p_id) => {
    dispatch(addToWishlist(p_id));
    setTimeout(() => {
      dispatch(getWishlist(user.id));
    }, 700);
  }, [dispatch, user.id]);
  

  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className=" row d-flex flex-wrap">
          { Array.isArray(wishlistProducts) && wishlistProducts && wishlistProducts?.length > 0 ? (
            wishlistProducts?.map((product, index) => (
             
              <PrdCard key={index} data={product} addToWishlist={addWishlist}/>
            ))
          ) : (
            <div className="col-12">
              <h2 className="text-center">No items in wishlist</h2>
            </div>
          )}
          {/* <ProductCard data={wishlistProducts} grid={4} /> */}

          {/* <div className="col-3">
            <div className="wishlist-card position-relative">
              <img
                src="images/cross.svg"
                alt="cross"
                className="position-absolute cross img-fluid"
              />
              <div className="wishlist-card-image">
                <img
                  src="images/watch.jpg"
                  className="img-fluid w-100"
                  alt="watch"
                />
              </div>
              <div className="py-3 px-3">
                <h5 className="title">
                  Honor T1 7.0 1 GB RAM 8 GB ROM 7 Inch With Wi-Fi+3G Tablet
                </h5>
                <h6 className="price">$ 100</h6>
              </div>
            </div>
          </div> */}
        </div>
      </Container>
    </>
  );
};

export default Wishlist;
