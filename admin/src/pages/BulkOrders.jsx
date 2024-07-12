import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Input } from "antd";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";

const BulkOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term


  const columns = [
    {
      title: "Date",
      dataIndex: "date_time",
      key:"date_time",
      sorter: (a, b) => new Date(b.date_time) - new Date(a.date_time)    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      sorter: (a, b) => a.order_id - b.order_id,
      defaultSortOrder: 'descend',

    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      sorter: (a, b) => a.mobile.localeCompare(b.mobile),
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      key: "order_status",
      sorter: (a, b) => a.order_status.localeCompare(b.order_status),
    },
    {
      title: "Order Status",
      dataIndex: "action",
      key: "action",
    },
    {
      title: 'View Ordered Products',
      dataIndex: 'view_ordered_products',
      key: 'view_ordered_products',
      render: (text, record) => (
        <Button type="primary" onClick={() => showOrderedProducts(record)}>
          View Ordered Products
        </Button>
      ),
    },

    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    }
  ];



  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const response = await axios.get(`${base_url}order/bulk`, config);
    console.log(response.data);
    setOrders(response.data);
  };

  const getOrderProducts = async (bulk_id) => {
    await axios.get(`${base_url}order/get-bulkorder-products/${bulk_id}`, config).then(
      response => {
        console.log(response.data);
        setOrderProducts(response.data);
      }
    ).catch(
      error => console.log(error)
      
    )
  };

  const updateOrderStatus = async (bulk_id, order_status) => {
    await axios.put(
      `${base_url}order/bulk/update-order/${bulk_id}`,
      { order_status },
      config
    );
    getOrders();
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const showOrderedProducts = (order) => {
    setSelectedOrder(order);
    setIsModalOpen2(true);
    getOrderProducts(order.order_id);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Filter orders based on the search term
  const filteredOrders = orders.filter(order => {
    return (
      String(order.bulk_id).includes(searchTerm) ||
      String(order.user_id).includes(searchTerm) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.mobile).includes(searchTerm) ||
      order.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.last_name.toLowerCase().includes(searchTerm.toLowerCase()) 
  
    );
  });

  const data1 = filteredOrders.map((order) => ({
    key: order.bulk_id,
    // date_time: Date(order.date_time),
    date_time: new Date(order.created_at).toLocaleDateString(),
    order_id: order.bulk_id,
    user_id: order.user_id,
    email: order.email,
    mobile: order.mobile,
    order_status: order.order_status,
    action: (
      <>
        <select
          onChange={(e) => updateOrderStatus(order.bulk_id, e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Contacted">Contacted</option>
          <option value="Invoice Sent">Invoice Sent</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </>
    ),
    first_name: order.firstname,
    last_name: order.lastname,
  
  }));

  return (
    <div>
      <h3 className="mb-4 title">Bulk Orders</h3>
      <Input
        placeholder="Search orders"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <div>
        <Table columns={columns} dataSource={data1} className=""/>
      </div>

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
            dataSource={orderProducts}
            pagination={false}
          />
        )}
        {orderProducts && orderProducts.length === 0 && <p>No products ordered.</p>}
      </Modal>
    </div>
  );
};

export default BulkOrders;


