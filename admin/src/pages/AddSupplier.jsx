import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { base_url } from "../utils/baseUrl.jsx";
import { config } from "../utils/axiosconfig.jsx";
import { Select } from "antd";

const { Option } = Select;

const AddSupplier = () => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${base_url}product/`)
      .then((response) => {
        console.log(response.data);
        const productOptions = response.data.map((product) => ({
          value: product.p_id,
          label: product.p_title,
        }));
        setOptions(productOptions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const validationSchema = Yup.object({
    supplierName: Yup.string().min(1).max(50).required("Supplier name is required"),
    supplierEmail: Yup.string().min(1).max(50)
      .email("Invalid email address")
      .required("Supplier email is required"),
    supplierPhone: Yup.string().required("Mobile number is required")
.matches(
      /^[0-9]{10}$/,
      "Mobile number must be exactly 10 digits"
    )
    .test(
      "is-positive-integer",
      "Mobile number must be a positive integer",
      (val) => val && /^\d+$/.test(val)
    ),
    supplierAddress: Yup.string().min(1).max(150).required("Supplier address is required"),
    productIds: Yup.array().min(1, "At least one product is required"),
  });

  const formik = useFormik({
    initialValues: {
      supplierName: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierAddress: "",
      productIds: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `${base_url}supplier/`,
          values,
          config
        );
        console.log(response.data);

        // reset form fields
        formik.resetForm();
        setSubmitting(false);
      } catch (error) {
        console.log(error);
        setSubmitting(false);
      }
    },
  });

  const handleProductSelect = (productIds) => {
    formik.setFieldValue("productIds", productIds);
  };

  return (
    <div className="add-supplier-container">
      <h2>Add Supplier</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="supplierName">Supplier Name</label>
          <input
            id="supplierName"
            name="supplierName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.supplierName}
            className="form-control"
          />
          {formik.touched.supplierName && formik.errors.supplierName && (
            <div className="text-danger">{formik.errors.supplierName}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="supplierEmail">Supplier Email</label>
          <input
            id="supplierEmail"
            name="supplierEmail"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.supplierEmail}
            className="form-control"
          />
          {formik.touched.supplierEmail && formik.errors.supplierEmail && (
            <div className="text-danger">{formik.errors.supplierEmail}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="supplierPhone">Supplier Phone</label>
          <input
            id="supplierPhone"
            name="supplierPhone"
            type="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.supplierPhone}
            className="form-control"
          />
          {formik.touched.supplierPhone && formik.errors.supplierPhone && (
            <div className="text-danger">{formik.errors.supplierPhone}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="supplierAddress">Supplier Address</label>
          <textarea
            id="supplierAddress"
            name="supplierAddress"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.supplierAddress}
            className="form-control"
          />
          {formik.touched.supplierAddress && formik.errors.supplierAddress && (
            <div className="text-danger">{formik.errors.supplierAddress}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="productIds">Associated Products</label>
          <Select
            id="productIds"
            name="productIds"
            mode="multiple"
            allowClear
            placeholder="Please select"
            value={formik.values.productIds}
            onChange={handleProductSelect}
            onBlur={formik.handleBlur}
            className="form-control"
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          {formik.touched.productIds && formik.errors.productIds && (
            <div className="text-danger">{formik.errors.productIds}</div>
          )}
        </div>
        <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary">
          Add Supplier
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { base_url } from "../utils/baseUrl.js";
// import { config } from "../utils/axiosconfig.js";
// import { Form, Input, Select, Row, Col } from "antd";

// const { Option } = Select;
// const { TextArea } = Input;

// const AddSupplier = () => {
//   const [supplierName, setSupplierName] = useState("");
//   const [supplierEmail, setSupplierEmail] = useState("");
//   const [supplierPhone, setSupplierPhone] = useState("");
//   const [supplierAddress, setSupplierAddress] = useState("");
//   const [productIds, setProductIds] = useState([]);
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${base_url}product/`)
//       .then((response) => {
//         console.log(response.data);
//         const productOptions = response.data.map((product) => ({
//           value: product.p_id,
//           label: product.p_title,
//         }));
//         setOptions(productOptions);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newSupplier = {
//       supplierName,
//       supplierEmail,
//       supplierPhone,
//       supplierAddress,
//       productIds,
//     };

//     try {
//       const response = await axios.post(
//         `${base_url}supplier/`,
//         newSupplier,
//         config
//       );
//       console.log(response.data);

//       const supplierId = response.data.supplier_id;

//       // reset form fields
//       setSupplierName("");
//       setSupplierEmail("");
//       setSupplierPhone("");
//       setSupplierAddress("");
//       setProductIds([]);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleProductSelect = (selectedOptions) => {
//     setProductIds(selectedOptions);
//   };

//   return (
//     <div>
//       <h2>Add Supplier</h2>
//       <Form onSubmit={handleSubmit}>
//         <Row gutter={16}>
//           <Col span={8}>
//             <Form.Item label="Supplier Name">
//               <Input
//                 id="supplierName"
//                 value={supplierName}
//                 onChange={(e) => setSupplierName(e.target.value)}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             {/* <Form.Item label="Supplier Email">
//               <Input
//                 type="email"
//                 id="supplierEmail"
//                 value={supplierEmail}
//                 onChange={(e) => setSupplierEmail(e.target.value)}
//               />
//             </Form.Item> */}
//             <Form.Item label="Supplier Email">
//               <Input
//                 // type="email"
//                 id="supplierEmail"
//                 defaultValue={supplierEmail}
//                 onChange={(e) => setSupplierEmail(e.target.value)}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item label="Supplier Phone">
//               <Input
//                 type="tel"
//                 id="supplierPhone"
//                 value={supplierPhone}
//                 onChange={(e) => setSupplierPhone(e.target.value)}
//               />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Form.Item label="Supplier Address">
//           <TextArea // Use TextArea here
//             id="supplierAddress"
//             value={supplierAddress}
//             onChange={(e) => setSupplierAddress(e.target.value)}
//           />
//         </Form.Item>
//         <Form.Item label="Associated Products">
//           <Select
//             id="productIds"
//             mode="multiple"
//             allowClear
//             placeholder="Please select"
//             value={productIds}
//             onChange={handleProductSelect}
//           >
//             {options.map((option) => (
//               <Option key={option.value} value={option.value}>
//                 {option.label}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item>
//           <button type="submit">Add Supplier</button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddSupplier;

// import React, { useState,useEffect } from 'react';
// import axios from 'axios';
// import { base_url } from '../utils/baseUrl.js';
// import { config } from '../utils/axiosconfig.js'
// import Select from 'react-select';

// const AddSupplier = () => {
//   const [supplierName, setSupplierName] = useState('');
//   const [supplierEmail, setSupplierEmail] = useState('');
//   const [supplierPhone, setSupplierPhone] = useState('');
//   const [supplierAddress, setSupplierAddress] = useState('');
//   const [productIds, setProductIds] = useState([]);
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     axios.get(`${base_url}product/`)
//       .then(response => {
//         console.log(response.data);
//         const productOptions = response.data.map(product => ({
//           value: product.p_id,
//           label: product.p_title
//         }));
//         setOptions(productOptions);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newSupplier = {
//       supplierName,
//       supplierEmail,
//       supplierPhone,
//       supplierAddress,
//       productIds
//     };

//     try {
//       const response = await axios.post(
//         `${base_url}supplier/`,
//         newSupplier,
//         config
//       );
//       console.log(response.data);

//       const supplierId = response.data.supplier_id;

//       // productIds.forEach(async (productId) => {
//       //   await axios.put(
//       //     `${base_url}product/update-product/${productId}`,
//       //     { supplier_id: supplierId },
//       //     config
//       //   );
//       // });

//       // reset form fields
//       setSupplierName('');
//       setSupplierEmail('');
//       setSupplierPhone('');
//       setSupplierAddress('');
//       setProductIds([]);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleProductSelect = (selectedOptions) => {
//     setProductIds(selectedOptions.map(option => option.value));
//   };

//   return (
//     <div>
//       <h2>Add Supplier</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="supplierName">Supplier Name:</label>
//           <input
//             type="text"
//             id="supplierName"
//             value={supplierName}
//             onChange={(e) => setSupplierName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="supplierEmail">Supplier Email:</label>
//           <input
//             type="email"
//             id="supplierEmail"
//             value={supplierEmail}
//             onChange={(e) => setSupplierEmail(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="supplierPhone">Supplier Phone:</label>
//           <input
//             type="tel"
//             id="supplierPhone"
//             value={supplierPhone}
//             onChange={(e) => setSupplierPhone(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="supplierAddress">Supplier Address:</label>
//           <textarea
//             id="supplierAddress"
//             value={supplierAddress}
//             onChange={(e) => setSupplierAddress(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="productIds">Associated Products:</label>
//           <Select
//             id="productIds"
//             options={options}
//             isMulti
//             value={options.filter(option => productIds.includes(option.value))}
//             onChange={handleProductSelect}
//           ></Select>
//         </div>
//         <button type="submit">Add Supplier</button>
//       </form>
//     </div>
//   );
//  };

//  export default AddSupplier;
