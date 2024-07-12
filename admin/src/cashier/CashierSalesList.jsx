import React from "react";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Table as AntTable } from "antd";

import { config } from "../utils/axiosconfig";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CashierSalesList = () => {
  const [sales, setSalesList] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSalesId, setCurrentSalesId] = useState(null);

  const id = JSON.parse(localStorage.getItem("user")).user_id;

  const fetchCashierSales = async () => {
    try {
      const response = await axios.get(`${base_url}user/cashier/sales`, config);
      console.log(response.data);
      setSalesList(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchProducts = async (salesId) => {
    try {
      const response = await axios.get(`${base_url}cashier/sales/products/${salesId}`, config);
      console.log(response.data);
      setProducts(response.data);
      setShowModal(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleViewProducts = (salesId) => {
    setCurrentSalesId(salesId);
    fetchProducts(salesId);
  };


  async function printBill(salesOrderId) {
    try {
      // Fetch the bill data from the backend API
      const response = await axios.get(
        `${base_url}user/print/bill/${salesOrderId}`
      );
      const items = response.data.items;
      const totalPrice = response.data.total_price;

      // Generate the pdf document
      const doc = new jsPDF();
      let yPos = 20;

      // Add title
      doc.setTextColor("#000000");
      doc.setFontSize(16);
      doc.text("SALES ORDER", 10, yPos, { align: "center" });
      yPos += 10;

      // Add items table
      doc.autoTable({
        head: [
          ["Item Name", "Size", "Color", "Unit Price", "Quantity", "Amount"],
        ],
        body: items.map((item) => [
          item.p_title,
          item.size_name,
          item.color_name,
          parseFloat(item.unit_price).toFixed(2),
          item.quantity,
          parseFloat(item.full_total_price).toFixed(2),
        ]),
        startY: yPos,
        styles: { fontSize: 10, overflow: "linebreak" },
        columnStyles: { amount: { cellWidth: 30 } },
      });

      // Calculate bottom position after adding items table
      yPos = doc.lastAutoTable.finalY;

      // Add subtotal
      doc.setFontSize(12);
      doc.text("Subtotal:", 10, yPos, { align: "left" });
      doc.text(`$${parseFloat(totalPrice).toFixed(2)}`, 140, yPos, {
        align: "right",
      });
      yPos += 10;

      // Save or preview the generated pdf
      doc.save("sales_order.pdf");
    } catch (error) {
      console.error(error);
    }
  }


  const columns = [
    {
      title: "Product Name",
      dataIndex: "p_title",
      key: "p_title",
    },
    {
      title: "Image",
      dataIndex: "image_link",
      key: "p_title",
      render: (text, record) => (
        <img
          src={record.image_links[0]}
          alt={record.p_title}
          // style={{ width: "50px" ,maxHeight:"50"}}
          width={90}
          height={90}
        />
      ),
    },
    {
      title: "Size",
      dataIndex: "size_name",
      key: "size_name",
    },
    {
      title: "Color",
      dataIndex: "col_name",
      key: "color_name",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  
  ];

  useEffect(() => {
    fetchCashierSales();
  }, []);

  return (
    <div>
      <h1>Cashier Sales List</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Sales ID</th>
            <th scope="col">Branch ID</th>
            <th scope="col">Order Date</th>
            <th scope="col">Products</th>
            <th scope="col">Print Bill</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.order_id}>
              <td>{sale.sales_id}</td>
              <td>{sale.branch_id == 1 ? "Gampaha": "Ganemulla" }</td>
              <td>{new Date(sale.date_time).toLocaleDateString()} | {new Date(sale.date_time).toLocaleTimeString()}</td>
              <td>
              <Button
                  type="primary"
                  onClick={() => handleViewProducts(sale.sales_id)}
                >
                  View Products
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => {
                    printBill(sale.sales_id);
                  }}
                >
                  Print Bill
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        title="Products"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        className="w-75"
        footer={[
          <Button key="close" onClick={() => setShowModal(false)}>
            Close
          </Button>,
        ]}
      >
        <AntTable columns={columns} dataSource={products} rowKey="id" />
      </Modal>
      
    </div>
  );
};

export default CashierSalesList;
