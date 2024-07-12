import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import watch from "../assets/watch.jpg";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  getCart,
  removeFromCartItem,
} from "../features/products/productSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);


  useEffect(() => {
    dispatch(getCart())
      .then(() => {
        console.log("Cart fetched successfully");
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }, [dispatch]);

  const cart = useSelector((state) => state?.product?.cart || []);
  console.log(cart);

  const loadState = useSelector((state) => state?.product?.isLoading);

  useEffect(() => {
    setCartItems(cart);
    let price = 0;
    cart?.forEach((item) => {
      if (item?.productDetails) { // add null check for item?.productDetails
        price += Number(item?.productDetails?.unit_price) * item?.quantity;
      }
    });
    setTotalPrice(price);
  }, [cart]); // Recalculate total price whenever cart changes
  // useEffect(() => {
  //   setCartItems(cart);
  //   let price = 0;
  //   cart?.forEach((item) => {
  //     if (item?.productDetails) { // add null check for item?.productDetails
  //       price += Number(item?.productDetails?.unit_price) * item?.quantity;
  //     }
  //   });
  //   setTotalPrice(price);
  // }, [totalPrice]);
  

  const handleQuantityChange = async (
    size_color_quantity_id,
    quantity,
    product_total
  ) => {
    const item = cartItems?.find(
      (item) => item.size_color_quantity_id === size_color_quantity_id
    );
    const availableQuantity = item?.productDetails?.size_color_quantity;

    if (quantity > availableQuantity) {
      // Show an error message to the user
      alert(
        `Only Rs ${availableQuantity} items are available for this product.`
      );
      return;
    }

    // Optimistically update the local state
    setCartItems((prevCartItems) => {
      
      // Find the item to update and update its quantity
      const updatedCartItems = prevCartItems.map((item) =>
        item.size_color_quantity_id === size_color_quantity_id
          ? { ...item, quantity }
          : item
      );
      return updatedCartItems;
    });

    try {
      // Dispatch the addToCart action
      await dispatch(
        addToCart({ size_color_quantity_id, quantity, product_total })
      );
      // If addToCart is successful, fetch the updated cart from the server
      // dispatch(getCart());

      setTimeout(() => {
        dispatch(getCart());
      }, 100);
    } catch (error) {
      // If addToCart fails, roll back the local state
      setCartItems((prevCartItems) => {
        // Find the item to update and revert its quantity
        const revertedCartItems = prevCartItems.map((item) =>
          item.size_color_quantity_id === size_color_quantity_id
            ? { ...item, quantity: item.quantity - quantity }
            : item
        );
        return revertedCartItems;
      });
      // Handle the error appropriately, e.g., show an error message to the user
      console.error(error);
    }
  };

  const handleRemoveFromCartItem = (x) => {
    dispatch(removeFromCartItem(x));
    setTimeout(() => {
      dispatch(getCart());
    }, 1000);
  };

  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
              <h4 className="cart-col-1">Product</h4>
              <h4 className="cart-col-2">Price</h4>
              <h4 className="cart-col-3">Quantity</h4>
              <h4 className="cart-col-4">Total</h4>
            </div>

            <div>
              {Array.isArray(cart) && cart.length > 0 && 
                cart?.map((item, index) => (
                  <div
                    key={index}
                    className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center"
                  >
                    <div className="cart-col-1 gap-15 d-flex align-items-center">
                      <div className="w-25">
                        <img
                          src={item?.productDetails?.image_link}
                          className="img-fluid"
                          alt="product_image"
                        />
                      </div>
                      <div className="w-75">
                        <p>{item?.productDetails?.p_title}</p>
                        <p>Size: {item?.productDetails?.size_name}</p>
                        <p>Color: {item?.productDetails?.col_name}</p>
                      </div>
                    </div>
                    <div className="cart-col-2">
                      <h5 className="price">
                        Rs {item?.productDetails?.unit_price}
                      </h5>
                    </div>
                    <div className="cart-col-3 d-flex align-items-center gap-15">
                      <div>
                        {loadState ? (
                          <input
                            disabled
                            type="number"
                            name=""
                            min={1}
                            max={item?.productDetails?.size_color_quantity}
                            value={item?.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item?.size_color_quantity_id,
                                parseInt(e.target.value),
                                Number(item?.productDetails?.unit_price) *
                                  parseInt(e.target.value)
                              )
                            }
                            className="form-control"
                            style={{
                              width: "80px",
                              backgroundColor: "lightgray",
                            }}
                            id=""
                          />
                        ) : (
                          <input
                            type="number"
                            name=""
                            min={1}
                            max={item?.productDetails?.size_color_quantity}
                            value={item?.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item?.size_color_quantity_id,
                                parseInt(e.target.value),
                                Number(item?.productDetails?.unit_price) *
                                  parseInt(e.target.value)
                              )
                            }
                            className="form-control"
                            style={{ width: "80px" }}
                            id=""
                          />
                        )}
                      </div>
                      <div>
                        <AiFillDelete
                          onClick={() =>
                            handleRemoveFromCartItem(item?.cart_item_id)
                          }
                          className="text-danger "
                        />
                      </div>
                    </div>
                    <div className="cart-col-4">
                      <h5 className="price">
                        Rs{" "}
                        {(
                          Number(item?.productDetails?.unit_price) *
                          item?.quantity
                        ).toFixed(2)}
                      </h5>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 py-2 mt-4">
            <div className="d-flex justify-content-between align-items-baseline">
              <Link to="/product" className="button">
                Continue To Shopping
              </Link>
              <div className="d-flex flex-column align-items-end">
                <h4>SubTotal: Rs {totalPrice.toFixed(2)}</h4>
                <p>Taxes and shipping calculated at checkout</p>
                <Link to="/checkout" className="button">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;
