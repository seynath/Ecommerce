import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Input, Select, Typography, Row, Col, Card } from "antd";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditSupplier = () => {
  const [supplier, setSupplier] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplierDetails, setSupplierDetails] = useState({});
  const location = useLocation();
  const supplierId = location.pathname.split("/")[3];
  const navigate = useNavigate()


  useEffect(() => {
    
    const fetchProducts = async () => {
      await axios.get(`${base_url}product`)
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    };

    const fetchSupplier1 = async () => {
      await axios.get(
        `${base_url}supplier/${supplierId}`
      ).then(
        (response) => {
          console.log(response.data);
          setSupplierDetails({
            supplier_id: response?.data[0]?.supplier_id,
            supplier_name: response.data[0]?.supplier_name,
            supplier_email: response.data[0]?.supplier_email,
            supplier_phone: response.data[0]?.supplier_phone,
            supplier_address: response.data[0]?.supplier_address,

          })
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      )
     
    };



    fetchSupplier1()
    fetchSupplier();
    fetchProducts();
  }, [supplierId]);




  
  const fetchSupplier = async () => {
    await axios.get(
      `${base_url}supplier/getsupplierbyid/${supplierId}`
    )
    .then((response) => {
      console.log(response.data);
      setSupplier(response.data);
      setProductIds(response.data.map((product) => product.p_id));
    })
    .catch((error) => {
      console.log(error);
    });
  };
  
  
  
  
  
  useEffect(() => {
      
      console.log(supplier);
      console.log(productIds);
  }, [supplier,productIds]);


  const handleUpdateSupplier = async (event) => {
    event.preventDefault();

    try {
      // // If no new productIds have been selected, keep the old ones
      // let updatedProductIds =
      //   updatedSupplier.productIds && updatedSupplier.productIds.length
      //     ? updatedSupplier.productIds
      //     : supplier.productIds;

      let updatedData = {
        supplierDetails: supplierDetails,
        productIds: productIds,
      };
console.log(updatedData);
      const response = await axios.put(
        `${base_url}supplier/update-supplier`,
        updatedData,
        config
      );
      if (response.status === 200) {
        fetchSupplier()
        // Show success message and redirect to supplier list
        toast.success("Supplier updated successfully");
        navigate("/admin/list-supplier")

      }
    } catch (error) {
      console.log(error);
      // Show error message
    }
  };


  const handleProductSelect = (value) => {
    console.log(value);
    // setProductIds(...productIds, value);
    setProductIds(value)
    // console.log(supplier);
    console.log(productIds);
  };

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleDeleteProduct = async (productId) => {
    try {
      console.log(productId);
      console.log(supplierId);
      const response = await axios.put(
        `${base_url}supplier/delete-supplier-products`,
        { productId: productId, supplierId: supplierId }
      );

      console.log(response);

      if (response.status === 200) {
        // Show success message
        // window.location.reload();
        fetchSupplier()
      }
    } catch (error) {
      console.log(error);
      // Show error message
    }
  };

  return (
    <div className="px-5 py-2">
      <h3 className="mb-4 title">Edit Supplier</h3>
      <form

        onSubmit={handleUpdateSupplier}
      >
        <label>Name: </label>
        <input
          value={supplierDetails.supplier_name}
          onChange={(e) =>
            setSupplierDetails({
              ...supplierDetails,
              supplier_name: e.target.value,
            })
          }
        />

        <label>Email: </label>

        <input
          type="email"
          name="email"
          value={supplierDetails.supplier_email}
          onChange={(e) =>
            setSupplierDetails({
              ...supplierDetails,
              supplier_email: e.target.value,
            })
          }
        />

        <label>Phone: </label>

        <input
          type="number"
          name="phone"
          value={supplierDetails.supplier_phone}
          onChange={(e) =>
            setSupplierDetails({
              ...supplierDetails,
              supplier_phone: e.target.value,
            })
          }
        />
        <label>Address: </label>
        <input
          type="text"
          name="address"
          value={supplierDetails.supplier_address}
          onChange={(e) =>
            setSupplierDetails({
              ...supplierDetails,
              supplier_address: e.target.value,
            })
          }
        />

        <div>
          <h1>Supplier Products</h1>

          {supplier && supplier.length > 0 ? (
            <Row gutter={[16, 16]}>
              {supplier.map((product,index) => (
                <Col key={index} span={6}>
                  <Card
                    cover={
                      <img
                        alt="product"
                        src={product.image_link}
                        height={200}
                      />
                    }
                    actions={[
                      <Button
                        key={product.p_id}
                        type="danger"
                        onClick={() => handleDeleteProduct(product.p_id)}
                      >
                        Delete Product
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Typography.Title level={5}>
                          {product.p_id}
                        </Typography.Title>
                      }
                      description={
                        <Typography.Paragraph>
                          {product.p_title}
                        </Typography.Paragraph>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Typography.Paragraph>
              No products supplied by this supplier.
            </Typography.Paragraph>
          )}
        </div>

        <div label="Products" name="product_ids">
  <Select
    mode="multiple"
    allowClear
    placeholder="Please select products"
    value={productIds}
    onChange={handleProductSelect}
    style={{ width: "100%" }}
  >
    {products.map((product) => (
      <Select.Option key={product.p_id} value={product.p_id}>
        {product.p_id} | {product.p_title}
      </Select.Option>
    ))}
  </Select>
</div>
{/* 
        <div label="Products" name="product_ids">
          <select
            mode="multiple"
            allowClear
            placeholder="Please select products"
            value={productIds}
            onChange={(e)=>(handleProductSelect(e.target.value))}
          >
            {products.map((product) => (
              <option key={product.p_id} value={product.p_id}>
                {product.p_id} | {product.p_title}
              </option>
            ))}
          </select>
        </div> */}

        <div wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Update Supplier
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSupplier;

// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Button, Form, Input, Select, Typography, Row, Col, Card } from "antd";
// import { base_url } from "../utils/baseUrl";
// import { config } from "../utils/axiosconfig";
// import { useLocation } from "react-router-dom";

// const EditSupplier = () => {
//   const [supplier, setSupplier] = useState({});
//   const [updatedSupplier, setUpdatedSupplier] = useState({});
//   const [productIds, setProductIds] = useState([]);
//   const [products, setProducts] = useState([]);
//   const location = useLocation();
//   const supplierId = location.pathname.split("/")[3];

//   useEffect(() => {
//     const fetchSupplier = async () => {
//       const response = await axios.get(
//         `${base_url}supplier/getsupplierbyid/${supplierId}`
//       );
//       console.log(response.data);
//       setSupplier(response.data);
//       setUpdatedSupplier(response.data);
//       setProductIds(response.data.product_ids);
//     };

//     const fetchProducts = async () => {
//       const response = await axios.get(`${base_url}product`);
//       console.log(response.data);
//       setProducts(response.data);
//     };

//     fetchSupplier();
//     fetchProducts();
//   }, [supplierId]);

//   const handleInputChange = (e) => {
//     setUpdatedSupplier({
//       ...updatedSupplier,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleProductSelect = (value) => {
//     setProductIds(value);
//   };

//   const formLayout = {
//     labelCol: { span: 8 },
//     wrapperCol: { span: 16 },
//   };

//   const handleDeleteProduct = async (productId) => {
//     try {
//       const response = await axios.put(
//         `${base_url}supplier/delete-supplier-products`,
//         {
//           productId: productId,
//           supplierId: supplierId,
//         },
//         config
//       );

//       if (response.data.success) {
//         // Show success message
//         window.location.reload();
//       }
//     } catch (error) {
//       console.log(error);
//       // Show error message
//     }
//   };

//   const updatedProductIds = useMemo(() => {
//     if (productIds && productIds.length == 0) {
//       return supplier.product_ids;
//     }
//     return productIds;
//   }, [productIds, supplier.product_ids]);

//   const handleUpdateSupplier = async () => {
//     try {
//       let updatedData = { ...supplier };
//       Object.keys(updatedSupplier).forEach((field) => {
//         if (updatedSupplier[field] !== supplier[field]) {
//           updatedData[field] = updatedSupplier[field];
//         }
//       });
//       updatedData.product_ids = updatedProductIds;

//       const response = await axios.put(
//         `${base_url}supplier/update-supplier/${supplierId}`,
//         updatedData,
//         config
//       );

//       if (response.data.success) {
//         // Show success message and redirect to supplier list
//       }
//     } catch (error) {
//       console.log(error);
//       // Show error message
//     }
//   };

//   return (
//     <div className="px-5 py-2">
//       <h3 className="mb-4 title">Edit Supplier</h3>
//       <Form
//         {...formLayout}
//         initialValues={supplier}
//         onFinish={handleUpdateSupplier}
//       >
//         <Form.Item
//           label="Supplier Name"
//           name="supplier_name"
//           rules={[{ required: true, message: "Please input supplier name!" }]}
//         >
//           <Input onChange={handleInputChange} />
//         </Form.Item>

//         <Form.Item
//           label="Supplier Email"
//           name="supplier_email"
//           rules={[{ required: true, message: "Please input supplier email!" }]}
//         >
//           <Input onChange={handleInputChange} />
//         </Form.Item>

//         <Form.Item
//           label="Supplier Phone"
//           name="supplier_phone"
//           rules={[{ required: true, message: "Please input supplier phone!" }]}
//         >
//           <Input onChange={handleInputChange} />
//         </Form.Item>

//         <Form.Item
//           label="Supplier Address"
//           name="supplier_address"
//           rules={[{ required: true, message: "Please input supplier address!" }]}
//         >
//           <Input.TextArea onChange={handleInputChange} />
//         </Form.Item>

//         <div>
//           <Typography.Title level={3}>Supplier Products</Typography.Title>

//           {supplier && supplier.product_ids && supplier.product_ids.length > 0 ? (
//   <Row gutter={[16, 16]}>
//     {supplier.product_ids.map((productId) => {
//       const product = products.find(
//         (product) => product.p_id === productId
//       );
//       return (
//         <Col key={productId} span={6}>
//           <Card
//             cover={
//               <img
//                 alt="product"
//                 src={product.image_link}
//                 height={200}
//               />
//             }
//             actions={[
//               <Button
//                 key={productId}
//                 type="danger"
//                 onClick={() => handleDeleteProduct(productId)}
//               >
//                 Delete Product
//               </Button>,
//             ]}
//           >
//             <Card.Meta
//               title={
//                 <Typography.Title level={5}>
//                   {product.p_id}
//                 </Typography.Title>
//               }
//               description={
//                 <Typography.Paragraph>
//                   {product.p_title}
//                 </Typography.Paragraph>
//               }
//             />
//           </Card>
//         </Col>
//       );
//     })}
//   </Row>
// ) : (
//   <Typography.Paragraph>
//     No products supplied by this supplier.
//   </Typography.Paragraph>
// )}

//         </div>

//         <Form.Item label="Products" name="product_ids">
//           <Select
//             mode="multiple"
//             allowClear
//             placeholder="Please select products"
//             value={productIds}
//             onChange={handleProductSelect}
//           >
//             {products.map((product) => (
//               <Select.Option key={product.p_id} value={product.p_id}>
//                 {product.p_id} | {product.p_title}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
//           <Button type="primary" htmlType="submit">
//             Update Supplier
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default EditSupplier;
