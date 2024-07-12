import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import watch from "../assets/watch.jpg";
import Container from "../components/Container";
import * as yup from "yup";
import { useFormik } from "formik";
import Meta from "../components/Meta";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../features/products/productSlice";
import { createOrder } from "../features/user/userSlice";
import axios from "axios";
import { base_url, config } from "../utils/axiosConfig";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(subTotalPrice);
  const [orderDetails, setOrderDetails] = useState('')

  const cart = useSelector((state) => state?.product?.cart || []);
  console.log(cart);
  useEffect(() => {
    setCartItems(cart);
    let price = 0;
    cart?.forEach((item) => {
      price += Number(item?.productDetails?.unit_price) * item?.quantity;
    });
    setSubTotalPrice(price);
    setTotalPrice(price);
  }, [cart]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCart());
  }, []);

  console.log(cart);

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .min(3)
      .max(20)
      .required("First name is required"),
    lastName: yup
      .string()
      .min(3)
      .max(20)
      .required("Last name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: yup
      .string()
      .required("Mobile number is required")
      .matches(
        /^[0-9]{10}$/,
        "Mobile number must be exactly 10 digits"
      )
      .test(
        "is-positive-integer",
        "Mobile number must be a positive integer",
        (val) => val && /^\d+$/.test(val)
      ),

    shippingAptNo: yup.string().max(30),
    shippingAddress: yup.string()
      .max(150)
      .required("Shipping address is required"),
    shippingCity: yup.string().max(40).required("City is required"),
    shippingState: yup.string().required("State is required"),
    shippingZipcode: yup
    .string()
    .max(10)
    .required("Zipcode is required")
    .test(
      "is-positive-integer",
      "Zipcode must be a positive integer",
      (val) => val && /^\d+$/.test(val)
    ),
    shippingCountry: yup.string().required("Country is required"),

    billingAptNo: yup.string(),
    billingAddress: yup
      .string()
      .max(150)
      .required("Billing address is required"),
    billingCity: yup.string().max(40).required("City is required"),
    billingState: yup.string().max(40).required("State is required"),
    billingZipcode: yup
    .string()
    .max(10)
    .required("Zipcode is required")
    .test(
      "is-positive-integer",
      "Zipcode must be a positive integer",
      (val) => val && /^\d+$/.test(val)
    ),
    billingCountry: yup.string().required("Country is required"),

    // payment methods enum , how i handle?

    paymentMethod: yup.string().required("Payment method is required"),
    message: yup.string().max(400),
    // .oneOf(["paypal", "stripe", "cash"], "Invalid payment method"),
    totalPrice: yup.number().required("Add Product to Cart"),
  });



  const handleSubmit = async (values) => {
    console.log(values);
    // .preventDefault();
    try {
        const response = await axios.post(`${base_url}order/createbycard`, {values,cart},
        config);

        const { id: sessionId, url: checkoutUrl } = response.data;
        window.open(checkoutUrl, '_blank');

        const checkPaymentStatus = setInterval(async () => {
            try {
                const updatedSession = await axios.get(`${base_url}order/paymentStatus/${sessionId}`);
                if (updatedSession.data.payment_status === 'paid') {
                  console.log();
                  dispatch(createOrder(values))
                    clearInterval(checkPaymentStatus);
                    window.location.href = "/success";
                } else if (updatedSession.data.payment_status === 'canceled') {
                  alert("wada na")
                    clearInterval(checkPaymentStatus);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, 3000);
    } catch (error) {
        console.error('Error processing payment:', error);
    }
};
const createOrderByCard = async (values) =>{

  console.log(values);
  await axios.post(
    `${base_url}order/createbycard`,
    {values,cart},
    config
  ).then(
    (res)=>{
      console.log(res);
      if(res.data.url){
        window.location.href = res.data.url;
      }
    }
  ).catch(
    (err)=>{
      console.log(err);
    }
  )
}

  // const createOrderByCard = async (values) =>{

  //   console.log(values);
  //   await axios.post(
  //     `${base_url}order/createbycard`,
  //     {values,cart},
  //     config
  //   ).then(
  //     (res)=>{
  //       console.log(res);
  //       if(res.data.url){
  //         window.location.href = res.data.url;
  //       }
  //     }
  //   ).catch(
  //     (err)=>{
  //       console.log(err);
  //     }
  //   )
  // }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      shippingAptNo: "",
      shippingAddress: "",
      shippingCity: "",
      shippingState: "",
      shippingZipcode: "",
      shippingCountry: "",
      billingAptNo: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZipcode: "",
      billingCountry: "",
      paymentMethod: "",
      message: "",
      totalPrice:totalPrice
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log({ values });
      if (cart.length === 0) {
        // Display an error message or a notification to the user
        console.log("Cart is empty, cannot place order");
        alert("Cart is empty, cannot place order");
        return;
      }
    
      setOrderDetails(values)
      if (values.paymentMethod === "Card") {
        // createOrderByCard(values);
        handleSubmit(values)
      } else {
        dispatch(createOrder(values))
          .then((response) => {
            console.log(response);
            if (response.payload.status === 201) {
              window.location.href = "/order";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    
  });
  useEffect(() => {
    formik.setFieldValue('totalPrice', totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    if (formik.errors) {
      console.log("Form errors:", formik.errors);
    }
  }, [formik.errors]);

  return (
    <>
      <Meta title={"Checkout"} />
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-7">
              <div className="checkout-left-data">
                <h3 className="website-name">Checkout</h3>
                <nav
                  style={{ "--bs-breadcrumb-divider": ">" }}
                  aria-label="breadcrumb"
                >
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link className="text-dark total-price" to="/cart">
                        Cart
                      </Link>
                    </li>
                    &nbsp;/ &nbsp;
                    <li
                      className="breadcrumb-ite total-price active"
                      aria-current="page"
                    >
                      Information
                    </li>
                    &nbsp;/ &nbsp;
                    <li className="breadcrumb-item total-price active">
                      Shipping
                    </li>
                    &nbsp;/ &nbsp;
                    <li
                      className="breadcrumb-item total-price active"
                      aria-current="page"
                    >
                      Payment
                    </li>
                  </ol>
                </nav>
                <h4 className="title total">Contact Information</h4>
                <p className="user-details total"></p>

                {/* ----------------------------------Shipping Form-------------------------------- */}
                <div
                  action=""
                  className="d-flex gap-15 flex-wrap justify-content-between"
                >
                  <h4 className="mb-3 w-100">Shipping Details</h4>
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="form-control"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange("firstName")}
                      onBlur={formik.handleBlur("firstName")}
                    />
                    <div className="error">
                      {formik.touched.firstName && formik.errors.firstName}
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="form-control"
                      name="lastName"
                      onChange={formik.handleChange("lastName")}
                      onBlur={formik.handleBlur("lastName")}
                      value={formik.values.lastName}
                    />
                    <div className="error">
                      {formik.touched.lastName && formik.errors.lastName}
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <input
                      type="text"
                      placeholder="Mobile No"
                      className="form-control"
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange("mobile")}
                      onBlur={formik.handleBlur("mobile")}
                      // minLength={10}
                      // min={10}
                      // max={10}
                    />
                    <div className="error">
                      {formik.touched.mobile && formik.errors.mobile}
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <input
                      type="text"
                      placeholder="Email"
                      className="form-control"
                      name="email"
                      onChange={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                      value={formik.values.email}
                    />
                    <div className="error">
                      {formik.touched.email && formik.errors.email}
                    </div>
                  </div>

                  <div className="w-100">
                    <input
                      name="shippingAptNo"
                      type="text"
                      placeholder="Apartment, Suite ,etc"
                      className="form-control"
                      value={formik.values.shippingAptNo}
                      onChange={formik.handleChange("shippingAptNo")}
                      onBlur={formik.handleBlur("shippingAptNo")}
                    />
                    <div className="error">
                      {formik.touched.shippingAptNo &&
                        formik.errors.shippingAptNo}
                    </div>
                  </div>

                  <div className="w-100">
                    <input
                      type="text"
                      name="shippingAddress"
                      placeholder="Shipping Address"
                      className="form-control"
                      value={formik.values.shippingAddress}
                      onChange={formik.handleChange("shippingAddress")}
                      onBlur={formik.handleBlur("shippingAddress")}
                    />
                    <div className="error">
                      {formik.touched.shippingAddress &&
                        formik.errors.shippingAddress}
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <input
                      type="text"
                      name="shippingCity"
                      placeholder="Shipping City"
                      className="form-control"
                      value={formik.values.shippingCity}
                      onChange={formik.handleChange("shippingCity")}
                      onBlur={formik.handleBlur("shippingCity")}
                    />
                    <div className="error">
                      {formik.touched.shippingCity &&
                        formik.errors.shippingCity}
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <select
                      name="shippingState"
                      className="form-control form-select"
                      id=""
                      value={formik.values.shippingState}
                      onChange={formik.handleChange("shippingState")}
                      onBlur={formik.handleBlur("shippingState")}
                    >
                      <option value="">Select State</option>
                      <option value="western">Western</option>
                      <option value="north-western">North Western</option>
                      <option value="northern">Northern</option>
                      <option value="nothern-western">North Western</option>
                      <option value="central">Central</option>
                      <option value="sabaragamuwa">Sabaragamuwa</option>
                      <option value="uva">Uva</option>
                      <option value="southern">Southern</option>
                      <option value="north-central">North Central</option>
                    </select>
                    <div className="error">
                      {formik.touched.shippingState &&
                        formik.errors.shippingState}
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <input
                      type="text"
                      name="shippingZipcode"
                      placeholder="Zipcode"
                      className="form-control"
                      value={formik.values.shippingZipcode}
                      onChange={formik.handleChange("shippingZipcode")}
                      onBlur={formik.handleBlur("shippingZipcode")}
                    />
                    <div className="error">
                      {formik.touched.shippingZipcode &&
                        formik.errors.shippingZipcode}
                    </div>
                  </div>

                  <div className="w-100">
                    <select
                      name="shippingCountry"
                      className="form-control form-select"
                      id=""
                      value={formik.values.shippingCountry}
                      onChange={formik.handleChange("shippingCountry")}
                      onBlur={formik.handleBlur("shippingCountry")}
                    >
                      <option value="">Select Country</option>

                      <option value="sri lanka">Sri Lanka</option>
                    </select>
                    <div className="error">
                      {formik.touched.shippingCountry &&
                        formik.errors.shippingCountry}
                    </div>
                  </div>

           

                  <div
                    className="billing-address-inputs w-100"
                    style={{ display: "block" }}
                  >
                    {/* billing address inputs here */}

                    <h4 className="mb-3 w-100">Billing Details</h4>

                    <div className="flex-grow-1">
                      <input
                        name="billingAptNo"
                        type="text"
                        placeholder="Apartment, Suite ,etc"
                        className="form-control"
                        value={formik.values.billingAptNo}
                        onChange={formik.handleChange("billingAptNo")}
                        onBlur={formik.handleBlur("billingAptNo")}
                      />
                      <div className="error">
                        {formik.touched.billingAptNo &&
                          formik.errors.billingAptNo}
                      </div>
                    </div>

                    <div className="flex-grow-1">
                      <input
                        type="text"
                        name="billingAddress"
                        placeholder="Billing Address"
                        className="form-control"
                        value={formik.values.billingAddress}
                        onChange={formik.handleChange("billingAddress")}
                        onBlur={formik.handleBlur("billingAddress")}
                      />
                      <div className="error">
                        {formik.touched.billingAddress &&
                          formik.errors.billingAddress}
                      </div>
                    </div>

                    <div className="flex-grow-1">
                      <input
                        type="text"
                        name="billingCity"
                        placeholder="Billing City"
                        className="form-control"
                        value={formik.values.billingCity}
                        onChange={formik.handleChange("billingCity")}
                        onBlur={formik.handleBlur("billingCity")}
                      />
                      <div className="error">
                        {formik.touched.billingCity &&
                          formik.errors.billingCity}
                      </div>
                    </div>

                    <div className="flex-grow-1">
                      <select
                        name="billingState"
                        className="form-control form-select"
                        id=""
                        value={formik.values.billingState}
                        onChange={formik.handleChange("billingState")}
                        onBlur={formik.handleBlur("billingState")}
                      >
                        <option value="">Select State</option>
                        <option value="western">Western</option>
                      <option value="north-western">North Western</option>
                      <option value="northern">Northern</option>
                      <option value="nothern-western">North Western</option>
                      <option value="central">Central</option>
                      <option value="sabaragamuwa">Sabaragamuwa</option>
                      <option value="uva">Uva</option>
                      <option value="southern">Southern</option>
                      <option value="north-central">North Central</option>
                      </select>
                      <div className="error">
                        {formik.touched.billingState &&
                          formik.errors.billingState}
                      </div>
                    </div>

                    <div className="flex-grow-1">
                      <input
                        type="text"
                        name="billingZipcode"
                        placeholder="Zipcode"
                        className="form-control"
                        value={formik.values.billingZipcode}
                        onChange={formik.handleChange("billingZipcode")}
                        onBlur={formik.handleBlur("billingZipcode")}
                        
                      />
                      <div className="error">
                        {formik.touched.billingZipcode &&
                          formik.errors.billingZipcode}
                      </div>
                    </div>

                    <div className="w-100">
                      <select
                        name="billingCountry"
                        className="form-control form-select"
                        id=""
                        value={formik.values.billingCountry}
                        onChange={formik.handleChange("billingCountry")}
                        onBlur={formik.handleBlur("billingCountry")}
                      >
                        <option value="">Select Country</option>

                        <option value="sri lanka">Sri Lanka</option>
                      </select>
                      <div className="error">
                        {formik.touched.billingCountry &&
                          formik.errors.billingCountry}
                      </div>
                    </div>
                  </div>
                  {/* <button className="button" type="submit">
                  Submit Delivery Details
                </button> */}
                </div>

                {/* End of the Form */}

                <div className="w-100 py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/cart" className="text-dark">
                      <BiArrowBack className="me-2" />
                      Return to Cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5">
              <div className="border-bottom py-4">
                <h4 className="title">Order Summary</h4>
                {cart &&
                  cart?.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex gap-10 mb-2 align-align-items-center"
                    >
                      <div className="w-75 d-flex gap-10">
                        <div className="w-25 position-relative">
                          <span
                            style={{ top: "-10px", right: "2px" }}
                            className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                          >
                            {item?.quantity}
                          </span>
                          <img
                          width={50}
                          height={50}
              
                            className="img-fluid "
                            src={item?.productDetails?.image_link}
                            alt="product"
                          />
                        </div>
                        <div>
                          <h5 className="total-price">
                            {item?.productDetails?.p_title}
                          </h5>
                          <p className="total-price">
                            {item?.productDetails?.size_name} /{" "}
                            {item?.productDetails?.col_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="total">Rs {item?.product_total}</h5>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="border-bottom py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 total">Subtotal</p>
                  <p className="mb-0 total-price">Rs {subTotalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bootom py-4">
                <h4 className="total">Total</h4>
                <h5 className="total-price">
                  {/* Rs {(subTotalPrice + shipping + tax).toFixed(2)}
                  */}
                  Rs {totalPrice.toFixed(2)}
                </h5>
              </div>
              <div className="border-bottom py-4">
                <h4 className="title">Order Note</h4>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="5"
                  placeholder="Enter your order note"
                  className="form-control"
                  value={formik.values.message}
                  onChange={formik.handleChange("message")}
                  onBlur={formik.handleBlur("message")}
                ></textarea>
              </div>

              <div className="error">
                {formik.touched.message && formik.errors.message}
              </div>

              <div className="border-bottom py-4">
                <h4 className="title">Payment Method</h4>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="flexRadioDefault1"
                    value="COD"
                    onChange={formik.handleChange("paymentMethod")}
                    onBlur={formik.handleBlur("paymentMethod")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    Cash on Delivery
                  </label>

                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="flexRadioDefault2"
                    value="Card"
                    onChange={formik.handleChange("paymentMethod")}
                    onBlur={formik.handleBlur("paymentMethod")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    Card Payment
                  </label>
                </div>

                <div className="error">
                  {formik.touched.paymentMethod && formik.errors.paymentMethod}
                </div>
              </div>

              <div className="py-4  ">
                <button className="button" type="submit">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default Checkout;