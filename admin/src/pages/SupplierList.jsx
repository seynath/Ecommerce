import React, { useState, useEffect } from "react";
import { Table, Modal, Button, message } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('')


  const columns = [
    {
      title: "Supplier ID",
      dataIndex: "supplier_id",
      key: "supplier_id",
    },
    {
      title: "Supplier Name",
      dataIndex: "supplier_name",
      key: "supplier_name",
    },
    {
      title: "Supplier Email",
      dataIndex: "supplier_email",
      key: "supplier_email",
    },
    {
      title: "Supplier Phone",
      dataIndex: "supplier_phone",
      key: "supplier_phone",
    },
    {
      title: "Supplier Address",
      dataIndex: "supplier_address",
      key: "supplier_address",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div className="d-flex" >
          {/* <Button
            type="primary"
            className="mx-1"
            onClick={() => {
              setSelectedSupplier(record);
              setIsModalOpen(true);
            }}
          >
            View Details
          </Button> */}
          <Button
            type="primary"
            className="mx-1"
            onClick={() => {
              setSelectedSupplier(record);
              setIsModalOpen2(true);
              getSupplierProducts(record.supplier_id); // pass the supplier id to fetch supplier products
            }}
          >
            View Supplier Products
          </Button>
          <Link to={`/admin/edit-supplier/${record.supplier_id}`}>
            <Button type="primary"
            className="mx-1">Edit</Button>
          </Link>
          <Button
            type="primary"
            className="mx-1"
            danger
            onClick={() => {
              setIsModalVisible(true)
              showDeleteConfirm(record.supplier_id)

            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    const response = await axios.get(`${base_url}supplier`, config);
    console.log(response.data);
    setSuppliers(response.data);
    console.log(suppliers);
  };

  const getSupplierProducts = async (supplierId) => {
    console.log(supplierId);
    const response = await axios.get(
      `${base_url}supplier/get-supplier-products/${supplierId}`,
      config
    );
    console.log(response.data);
    setSupplierProducts(response.data);
  };

  const deleteSupplier = async (supplierId) => {
    try {
      await axios.delete(`${base_url}supplier/${supplierId}`, config);
      getSuppliers();
    } catch (error) {
      console.log(error);
      message.error("Error deleting supplier");
    }
  };




  const showDeleteConfirm = (supplier_id) => {
    setIsModalVisible(true);
    setSelectedSupplierId(supplier_id)
  };

  const handleOk = () => {
    deleteSupplier(selectedSupplierId)
    setIsModalVisible(false);
    // refresh page
    setTimeout(()=>{
      window.location.reload();

    }, 1000)
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const data1 = suppliers.map((supplier) => ({
    key: supplier.supplier_id,
    ...supplier,
  }));

  return (
    <div className="px-5 py-2">
      <h3 className="mb-4 title">Supplier List</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
  
      <Modal
        title="Supplier Products"
        className="w-75"
        open={isModalOpen2}
        onOk={() => setIsModalOpen2(false)}
        onCancel={() => setIsModalOpen2(false)}
      >
        {supplierProducts && supplierProducts.length > 0 && (
          <Table
            columns={[
              {
                title: "Product ID",
                dataIndex: "p_id",
                key: "p_id",
              },
              {
                title: "Product Name",
                dataIndex: "p_title",
                key: "p_title",
              },
              {
                title: "Product Slug",
                dataIndex: "p_slug",
                key: "p_slug",
              },
              {
                title: "Product Description",
                dataIndex: "p_description",
                key: "p_description",
              },
              {
                title: "Brand",
                dataIndex: "brand",
                key: "brand",
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
              },
              {
                title: "Price",
                dataIndex: "price",
                key: "price",
              },
            ]}
            dataSource={supplierProducts}
            pagination={false}
          />
        )}
        {supplierProducts && supplierProducts.length === 0 && (
          <p>No products for this supplier.</p>
        )}
      </Modal>

      <Modal
        title="Delete Product"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </div>
  );
};

export default SupplierList;
