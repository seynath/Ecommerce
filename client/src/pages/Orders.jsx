import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Input } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url } from "../utils/axiosConfig";
import { config } from "../utils/axiosConfig";
import Title from "antd/es/skeleton/Title";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [enquiry, setEnquiry] = useState("");
  const [enquiryHistory, setEnquiryHistory] = useState([]);
  const [order_ID, setOrder_ID] = useState("");
const [enquiryMessage, setEnquiryMessage] = useState("");

  const [bulkOrders, setBulkOrders] = useState([]);
  const [bulkOrderProducts, setBulkOrderProducts] = useState([]);

  const handleEnquirySubmit = async (enquiry, order_ID) => {
    if (!validateEnquiry(enquiry)) {
      alert("Enquiry message should be below 500 characters");
      return;
    }

    if(enquiry == ""){
      alert("Please enter enquiry message")
      return;
    }
    try {

      console.log(enquiry, order_ID);
      const response = await axios.post(`${base_url}enquiry/`, {
        enquiry,
        orderId: order_ID,
      });

      if (response) {
        // setIsModalVisible(false);
        fetchEnquiryHistory(order_ID);
      } else {
        console.log("Error submitting enquiry");

        // Handle error
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  const validateEnquiry = (enquiry) => {
    return enquiry.length <= 500;
  };

  const fetchEnquiryHistory = async (orderId) => {
    try {
      const response = await axios.get(`${base_url}enquiry/${orderId}`);
      console.log(response.data);

      if (response.data) {
        setEnquiryHistory(response.data);
      } else {
        // Handle error
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      sorter:(a, b) => a.order_id - b.order_id,
      defaultSortOrder: 'descend',

    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      key: "order_status",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "View Ordered Products",
      dataIndex: "view_ordered_products",
      key: "view_ordered_products",
      // render: (text, record) => (
      //   <Button type="primary" onClick={() => showOrderedProducts(record)}>
      //     View Ordered Products
      //   </Button>
      // ),
    },
  ];




  useEffect(() => {
    getOrders();
    getBulkOrders() 
   }, []);

  const getOrders = async () => {
    const response = await axios.get(`${base_url}user/get-ordersbyid`, config);
    console.log(response.data);
    setOrders(response.data.orders);
    console.log(orders);
  };

  const getOrderProducts = async (orderId) => {
    const response = await axios.get(
      `${base_url}user/get-order-products/${orderId}`,
      config
    );

    console.log(response.data[0]);

    const productsInOrder = response.data[0];
    setOrderProducts(productsInOrder);
  };


  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const showOrderedProducts = (order) => {
    setSelectedOrder(order);
    setIsModalOpen2(true);
    getOrderProducts(order.order_id); // pass the order id to fetch ordered products
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalVisible3(false)

  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalVisible3(false);
  };

  const getBulkOrderProducts = async (bulk_id) => {
    console.log(bulk_id);
    await axios.get(`${base_url}order/get-bulkorder-products/${bulk_id}`, config)
    .then(response => {
      console.log(response.data);
      setBulkOrderProducts(response.data);
    }).catch(
      error => console.log(error)
    )
  }

  const getBulkOrders = async () =>{
    const response = await axios.get(`${base_url}order/bulk/ordersByID`, config);
    console.log(response.data);
    setBulkOrders(response.data);
  }

  const showBulkOrderedProducts = (bulk_id) => {
    setIsModalVisible3(true);
    getBulkOrderProducts(bulk_id);
  }

  const data1 =
    orders &&
    orders.map((order) => ({
      key: order.order_id,
      order_id: order.order_id,
      payment_method: order.payment_method,
      email: order.email,
      mobile: order.mobile,
      order_status: order.order_status,
      shipping_address: order.shipping_address,
      shipping_apt_no: order.shipping_address,
      shipping_city: order.shipping_city,
      shipping_country: order.shipping_country,
      shipping_state: order.shipping_state,
      shipping_zip: order.shipping_zip,
      total_amount: order.total_amount,

      action: (
        <div className="d-flex">
          <button
            type=""
            className="button border-0"
            onClick={() =>
              showModal({
                ...selectedOrder,
                order_id: order.order_id,
                shipping_address: order.shipping_address,
                shipping_city: order.shipping_city,
                shipping_country: order.shipping_country,
                shipping_state: order.shipping_state,
                shipping_zip: order.shipping_zip,
                payment_method: order.payment_method,
                email: order.email,
                mobile: order.mobile,
                total_amount: order.total_amount,
                shipping_apt_no: order.shipping_apt_no,
              })
            }
          >
            Order Details
          </button>

          <button
            type=""
            className="button border-0 mx-1"
            onClick={async () => {
              setOrder_ID(order.order_id);
              setEnquiry(""); // Reset enquiry when opening the modal

              await fetchEnquiryHistory(order.order_id);
              setIsModalVisible(true);
            }}
          >
            Enquiry
          </button>
        </div>
      ),
      view_ordered_products: (
        <button
          type=""
          className="button border-0"
          onClick={() => showOrderedProducts(order)}
        >
           Ordered Products
        </button>
      ),
    }));

    const data2 = 
    bulkOrders && bulkOrders.map((bulkorder)=>(
      {
        key: bulkorder.bulk_id,
        bulk_id: bulkorder.bulk_id,
        order_status: bulkorder.order_status,
      
        view_ordered_products: (
          <button
            type=""
            className="button border-0"
            onClick={() => showBulkOrderedProducts(bulkorder.bulk_id)}
          >
             Ordered Products
          </button>
        )
      }
    ))

    const data3 =
    bulkOrderProducts &&
    bulkOrderProducts.map((product) => ({
      key: product.p_id,
      product_id: product.p_id,
      p_title: product.p_title,
      bulk_quantity: product.bulk_quantity,
      size_name: product.size_name,
      col_name: product.col_name,
    }));

  return (
    <div className="px-5 py-2">
      <h3 className="mb-4 title">My Orders</h3>
      <div>{<Table columns={columns} dataSource={data1} />}</div>
      {/* <h3 className="mb-4 title">Bulk Orders</h3> */}
      {/* <div>{<Table columns={bulkColumn} dataSource={data2} />}</div> */}

      <Modal
        title="Order Details"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedOrder && (
          <div>
            <p>Order ID: {selectedOrder.order_id}</p>
            <p>Shipping Address: {selectedOrder.shipping_address}</p>
            <p>Shipping Apt No: {selectedOrder.shipping_apt_no}</p>
            <p>Shipping City: {selectedOrder.shipping_city}</p>
            <p>Shipping Country: {selectedOrder.shipping_country}</p>
            <p>Shipping State: {selectedOrder.shipping_state}</p>
            <p>Shipping Zip: {selectedOrder.shipping_zip}</p>
            {/* <p>Order Date: {selectedOrder.date_time}</p> */}
            <p>Payment Method: {selectedOrder.payment_method}</p>
            <p>Email: {selectedOrder.email}</p>
            <p>Mobile: {selectedOrder.mobile}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </Modal>
      <Modal
        title="Ordered Products"
        open={isModalOpen2}
        onOk={() => setIsModalOpen2(false)}
        onCancel={() => setIsModalOpen2(false)}
        className="w-75"
      >
        {orderProducts && orderProducts.length > 0 && (
          <Table
   
            columns={[
            {
              title: 'Product Id',
              dataIndex: 'product_id',
              key: 'product_id',
            },
            {
              title: 'Product Name',
              dataIndex: 'p_title',
              key: 'p_title',
            },
            {
              title: 'Price',
              dataIndex: 'unit_price',
              key: 'unit_price',
            },
            {
              title:"Size",
              dataIndex:'size_name',
              key:"size_name"
            },
            {
              title:"Color",
              dataIndex:'col_name',
              key:"col_name"
            },
            {
              title: 'Quantity',
              dataIndex: 'ordered_quantity',
              key: 'ordered_quantity',
            },
            {
              title:"Unit Price",
              dataIndex:'unit_price',
              key:"unit_price"
            },
            {
              title: 'Total',
              dataIndex: 'total_price',
              key: 'total_price',
            },
            // button
            {
              title: 'Action',
              key: 'action',
              render: (text, record) => (
                <button className="button border-0">
                  <Link to={`/product/${record.product_id}`} className="text-white">
                    View Product
                  </Link>
                </button>
              ),
            }

            ]}
            dataSource={orderProducts}
            pagination={false}
          />
        )}
        {orderProducts && orderProducts.length === 0 && (
          <p>No products ordered.</p>
        )}
      </Modal>

      <Modal
        title="Enquiry"
        visible={isModalVisible}
        okText="Submit Enquiry"
        onOk={() => handleEnquirySubmit(enquiry, order_ID)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input.TextArea
          value={enquiry}
          onChange={(e) => setEnquiry(e.target.value)}
          placeholder="Write your enquiry here"
        />
      <h6 className="mb-4 mt-3 title">Enquiry History</h6>
        <ul className="table">
          {/* Display customer's history about this order here */}

          {enquiryHistory &&
            enquiryHistory.map((enquiry) => (
              <li key={enquiry.enquiry_id}>
                <div className="d-flex justify-content-between">
                  <span>{enquiry.message} </span>
                  <span>| {enquiry.enquiry_status}</span>
                </div>
              </li>
            ))}
        </ul>
      </Modal>
      {/* <Modal
        title="Bulk Ordered Products"
        visible={isModalVisible3}
        okText="Ok"
        onOk={handleOk}
        onCancel={handleCancel}
      >
      {bulkOrderProducts && bulkOrderProducts.length > 0 && (
          <Table
          
            columns={[

              {
                title: 'Product Id',
                dataIndex: 'product_id',
                key: 'product_id',
              },
              {
                title: 'Product Name',
                dataIndex: 'p_title',
                key: 'p_title',
              },
     
              {
                title: 'Quantity',
                dataIndex: 'bulk_quantity',
                key: 'bulk_quantity',
              },
              {
                title:"Size",
                dataIndex:'size_name',
                key:"size_name"
              },
              {
                title:"Color",
                dataIndex:'col_name',
                key:"col_name"
              },
   
          
            ]}
            dataSource={data3}
            pagination={false}
          />
        )}
        {bulkOrderProducts && bulkOrderProducts.length === 0 && <p>No products ordered.</p>}
      </Modal> */}
    </div>
  );
};

export default Orders;
