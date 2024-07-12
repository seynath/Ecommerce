import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getSingleProduct } from "../features/products/productSlice";
import { toast } from "react-toastify";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import Color from "../components/Color";
import ReactImageZoom from "react-image-zoom";
import { base_url ,config} from "../utils/axiosConfig";
import axios from "axios";

const BulkOrder = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const getProductId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bulkOrders, setBulkOrders] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { singleProduct } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getSingleProduct(getProductId));
  }, [dispatch, getProductId]);

  const handleColorChange = (colorCode) => {
    setSelectedColor(colorCode);
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSize(sizeId);
  };

  const addBulkOrder = () => {
    if (!selectedColor || !selectedSize || quantity <= 0) {
      toast.error("Please select color, size, and quantity.");
      return;
    }
    setBulkOrders([
      ...bulkOrders,
      {
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      },
    ]);
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  };
  console.log(bulkOrders);

  const submitBulkOrder = async() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (bulkOrders.length !== 0) {
      await axios.post(`${base_url}order/bulk`, {bulkOrders:bulkOrders, product_id: getProductId}, config)
      .then(
        (response) => {
          if(response.status == 201){
            toast.success("Bulk order request submitted!");
            setBulkOrders([]);
          }
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      )
    }

    // // Here you can handle the bulk order submission
    // console.log("Bulk Order Submitted", bulkOrders);
    // toast.success("Bulk order request submitted!");
    // setBulkOrders([]);
  };

  const uniqueSizes = singleProduct?.size_color_quantity
    ?.map((scq) => ({ size_id: scq.size_id, size_name: scq.size_name }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.size_id === value.size_id)
    );

  const props = {
    width: 594,
    height: 600,
    zoomWidth: 600,

    img: singleProduct?.image_link
      ? singleProduct?.image_link
      : "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg",
  };

  return (
    <>
      <Meta title="Bulk Order" />
      <BreadCrumb title="Bulk Order" />
      <Container class1="main-product-wrapper py-5 home-wrapper-2">
        <h3 className="title">Bulk Order</h3>
        <div className="row">
          <div className="col-6">
            <div className="main-product-image">
              <div>
                <ReactImageZoom {...props} />
              </div>
            </div>
            <div className="other-product-images d-flex flex-wrap gap-15">
              {singleProduct?.images?.map((image, index) => (
                <div key={index}>
                  <img src={image.image_link} className="img-fluid" alt="" />
                </div>
              ))}
            </div>
          </div>

          <div className="bulk-order-form col-6 p-3">
            <div className="d-flex gap-10 flex-column mt-2 mb-3">
              <h3 className="product-heading">Size :</h3>
              <div className="d-flex flex-wrap gap-15">
                {uniqueSizes?.map((scq) => (
                  <span
                    key={scq.size_id}
                    style={{ cursor: "pointer" }}
                    className={`badge border border-1 text-dark border-secondary ${
                      scq.size_id === parseInt(selectedSize) ? "bg-danger" : ""
                    }`}
                    onClick={() => handleSizeChange(scq.size_id)}
                  >
                    {scq.size_name}
                  </span>
                ))}
              </div>
            </div>
            <div className="d-flex gap-10 flex-column mt-2 mb-3">
              <h3 className="product-heading">Color :</h3>
              <Color
                sizeColorQuantity={singleProduct?.size_color_quantity}
                onColorChange={handleColorChange}
                selectedColor={selectedColor}
              />
            </div>
            <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
              <h3 className="product-heading">Quantity :</h3>
              <div>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-control"
                  style={{ width: "70px" }}
                />
              </div>
            </div>
            <button
              className="button border-0"
              type="button"
              onClick={addBulkOrder}
            >
              Add to Bulk Order
            </button>
            <div className="mt-4">
              <h4>Current Bulk Order</h4>
              <ul>
                {bulkOrders.map((order, index) => (
                  <li key={index} style={{width:"300px"}}>
                   
                    Color: { <span
                      key={order.color}
                      style={{
                        backgroundColor: order.color,
                        cursor: "pointer",
                        border: "1px solid rgb(254,189,105)",
                      }}
                      className="bulk-color "
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}, Size: {order.size}, Quantity:{" "}
                    {order.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="button border-0 mt-3"
              type="button"
              onClick={submitBulkOrder}
            >
              Submit Bulk Order
            </button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default BulkOrder;
