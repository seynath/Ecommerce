// import { React, useEffect, useState } from "react";
// import CustomInput from "../components/CustomInput";
// import ReactQuill from "react-quill";
// import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";
// import { toast } from "react-toastify";
// import * as yup from "yup";
// import { useFormik } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { getCategories } from "../features/pcategory/pcategorySlice";
// import { getColors } from "../features/color/colorSlice";
// import { Select } from "antd";
// import Dropzone from "react-dropzone";
// import { createProducts, resetState } from "../features/product/productSlice";
// import { getSizes } from "../features/size/sizeSlice";

// let schema = yup.object().shape({
//   title: yup.string().min(1).max(150).required("Title is Required"),
//   description: yup.string().min(1).max(500).required("Description is Required"),
//   brand: yup.string().min(1).max(30).required("Brand is Required"),
//   category: yup.number().required("Category is Required"),
//   attributes: yup.array().required("Attribute is Required"),
// });

// const Addproduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [color, setColor] = useState([]);
//   const [images, setImages] = useState([]);
//   const [size, setSize] = useState([]);
//   const [attributes, setAttributes] = useState([
//     { size: "", color: "", quantity: "", price: "", buyingPrice: "" },
//   ]);

//   useEffect(() => {
//     dispatch(getCategories());
//     dispatch(getColors());
//     dispatch(getSizes());
//   }, []);

//   const catState = useSelector((state) => state.pCategory.pCategories);
//   const colorState = useSelector((state) => state.color.colors);
//   const sizeState = useSelector((state) => state.size.sizes);
//   const newProduct = useSelector((state) => state.product);
//   const { isSuccess, isError, isLoading, createdProduct } = newProduct;

//   useEffect(() => {
//     if (isSuccess && createdProduct) {
//       toast.success("Product Added Successfullly!");
//     }
//     if (isError) {
//       toast.error("Something Went Wrong!");
//     }
//   }, [isSuccess, isError, isLoading]);

//   const coloropt = [];

//   colorState.forEach((i) => {
//     coloropt.push({
//       label: i.col_name,
//       value: i.col_code,
//     });
//   });

//   const sizeopt = [];

//   sizeState.forEach((i) => {
//     sizeopt.push({
//       label: i.size_name,
//       value: i.size_id,
//     });
//   });

//   const handleAttributeChange = (idx, e) => {
//     const { name, value } = e.target;
//     const newAttributes = [...attributes];
//     newAttributes[idx][name] = value;
//     setAttributes(newAttributes);
//   };

//   useEffect(() => {
//     formik.setFieldValue("images", images);
//   }, [images]);

//   useEffect(() => {
//     formik.setFieldValue("attributes", attributes);
//   }, [attributes]);

//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       description: "",
//       brand: "",
//       category: "",
//       images: [], // Add this to handle images
//       attributes: [
//         { size: "", color: "", quantity: 0, price: 0, buyingPrice: 0 },
//       ],
//     },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       const formData = new FormData();
//       formData.append("title", values.title);
//       formData.append("description", values.description);
//       formData.append("brand", values.brand);
//       formData.append("category", values.category);
//       for (let i = 0; i < values.images.length; i++) {
//         formData.append("images", values.images[i]);
//       }
//       formData.append("attributes", JSON.stringify(values.attributes));
//       console.log(formData);
//       dispatch(createProducts(formData)).then((response) => {
//         console.log(response.payload.status);
//         if (response.payload.status === 200) {
//           toast.success("Product Added Successfully!");
//           navigate("/admin/list-product");
//         }
//       });
//       // formik.resetForm();

//       // setTimeout(() => {
//       //   dispatch(resetState());
//       //   window.location.reload()

//       // }, 2000);
//     },
//   });

//   return (
//     <div className="container">
//       {" "}
//       {/* Added Bootstrap container class */}
//       <h3 className="mb-4 title text-center">Add Product</h3>{" "}
//       {/* Added Bootstrap text-center class */}
//       <div>
//         <form
//           onSubmit={formik.handleSubmit}
//           className="d-flex gap-3 flex-column p-5"
//         >
//           <div className="d-flex align-items-center mb-3">
//             <label htmlFor="title" className="form-label me-2">
//               Enter Product Title:
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formik.values.title}
//               onChange={formik.handleChange("title")}
//               onBlur={formik.handleBlur("title")}
//               className="form-control"
//               style={{ width: "calc(100% - 100px)" }} // Inline CSS for width
//             />
//           </div>
//           <div className="error text-danger">
//             {" "}
//             {/* Added Bootstrap text-danger class for error */}
//             {formik.touched.title && formik.errors.title}
//           </div>

//           <div className="mb-3">
//             <ReactQuill
//               placeholder="Add Description"
//               theme="snow"
//               name="description"
//               onChange={formik.handleChange("description")}
//               value={formik.values.description}
//               className="w-100"
//             />
//           </div>
//           <div className="error text-danger">
//             {" "}
//             {/* Added Bootstrap text-danger class for error */}
//             {formik.touched.description && formik.errors.description}
//           </div>

//           <div className="d-flex align-items-center mb-3">
//             <label htmlFor="brand" className="form-label me-2">
//               Enter Product Brand:
//             </label>
//             <input
//               type="text"
//               id="brand"
//               name="brand"
//               value={formik.values.brand}
//               onChange={formik.handleChange("brand")}
//               onBlur={formik.handleBlur("brand")}
//               className="form-control"
//               style={{ width: "calc(100% - 100px)" }} // Inline CSS for width
//             />
//           </div>
//           <div className="error text-danger">
//             {" "}
//             {/* Added Bootstrap text-danger class for error */}
//             {formik.touched.brand && formik.errors.brand}
//           </div>

//           {/* Category */}
//           <div className="d-flex align-items-center mb-3">
//             <label htmlFor="category" className="form-label me-2">
//               Select Category:
//             </label>
//             <select
//               id="category"
//               name="category"
//               onChange={formik.handleChange("category")}
//               onBlur={formik.handleBlur("category")}
//               value={formik.values.category}
//               className="form-select py-3 mb-3"
//               style={{ width: "calc(100% - 100px)" }} // Inline CSS for width
//             >
//               <option value="">Select Category</option>
//               {catState.map((i, j) => {
//                 return (
//                   <option key={j} value={i.cat_id}>
//                     {i.cat_name}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//           <div className="error text-danger">
//             {" "}
//             {/* Added Bootstrap text-danger class for error */}
//             {formik.touched.category && formik.errors.category}
//           </div>

//           <div className="d-flex align-items-center mb-3">
//             <label htmlFor="category" className="form-label mx-2">
//               Add Images:
//             </label>
//             <div className="bg-white border border-secondary p-5 text-center">
//             {/* <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}> */}
//             <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}>
//               {({ getRootProps, getInputProps }) => (
//                 <section>
//                   <div {...getRootProps()}>
//                     <input {...getInputProps()} />
//                     <div className="text-secondary">
//                       Drag & drop some files here, or click to select files
//                     </div>
//                   </div>
//                 </section>
//               )}
//             </Dropzone>
//           </div>
//           </div>

//           <div className="showimages d-flex flex-wrap gap-3 ">
//             {images.map((image, index) => (
//               <div className="position-relative" key={index}>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setImages(images.filter((img) => img !== image))
//                   }
//                   className="btn-close btn-close-white position-absolute"
//                   style={{ top: "10px", right: "10px" }}
//                 ></button>
//                 <img
//                   src={URL.createObjectURL(image)}
//                   alt=""
//                   width={200}
//                   height={200}
//                 />
//               </div>
//             ))}
//           </div>

//           {attributes.map((attribute, idx) => (
//             <div key={idx} className="d-flex align-items-center mb-3">
//               <label htmlFor={`size-${idx}`} className="form-label me-2">
//                 Size:
//               </label>
//               <select
//                 id={`size-${idx}`}
//                 name="size"
//                 className="form-select w-100"
//                 placeholder="Select Size"
//                 value={attribute.size}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 required
//                 style={{ width: "calc(100% - 100px)" }} // Inline CSS for width
//               >
//                 <option value="">Select Size</option>
//                 {sizeState.map((i, j) => (
//                   <option key={j} value={i.size_id}>
//                     {i.size_name}
//                   </option>
//                 ))}
//               </select>

//               <label htmlFor={`color-${idx}`} className="form-label me-2">
//                 Color:
//               </label>
//               <select
//                 id={`color-${idx}`}
//                 name="color"
//                 className="form-select w-100"
//                 placeholder="Select Color"
//                 value={attribute.color}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 required
//                 style={{ width: "calc(100% - 100px)" }} // Inline CSS for width
//               >
//                 <option value="">Select Color</option>
//                 {colorState.map((i, j) => (
//                   <option key={j} value={i.col_code}>
//                     {i.col_name}
//                   </option>
//                 ))}
//               </select>

//               <label htmlFor={`quantity-${idx}`} className="form-label me-2">
//                 Quantity:
//               </label>
//               <input
//                 type="number"
//                 id={`quantity-${idx}`}
//                 name="quantity"
//                 placeholder="Quantity"
//                 value={attribute.quantity}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 min={1}
//                 max={100}
//                 required
//                 className="form-control w-100"
//                 style={{ width: "calc(100% - 100px)" }} // Inline CSS for width
//               />

//               <label htmlFor={`price-${idx}`} className="form-label me-2">
//                 Price:
//               </label>
//               <input
//                 type="number"
//                 id={`price-${idx}`}
//                 name="price"
//                 placeholder="Price"
//                 value={attribute.price}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 min={1}
//                 max={999999}
//                 required
//                 className="form-control w-100"
//                 style={{ width: "calc(100% - 100px)" }} // Inline CSS for width
//               />

//               <label htmlFor={`buyingPrice-${idx}`} className="form-label me-2">
//                 Purchased Price:
//               </label>
//               <input
//                 type="number"
//                 id={`buyingPrice-${idx}`}
//                 name="buyingPrice"
//                 placeholder="Purchased Price"
//                 value={attribute.buyingPrice}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 min={1}
//                 max={999999}
//                 required
//                 className="form-control w-100"
//                 style={{ width: "calc(100% - 100px)" }} // Inline CSS for width
//               />

//               {/* <button
//                 type="button"
//                 onClick={() =>
//                   setAttributes(attributes.filter((_, i) => i !== idx))
//                 }
//                 className="btn btn-danger btn-sm"
//               >
//                 Remove
//               </button> */}

//               {idx !== 0 && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setAttributes(attributes.filter((_, i) => i !== idx))
//                   }
//                   className="btn btn-danger btn-sm"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}

//           <div className="d-flex w-100 py-2 px-2 justify-content-around">
//             <button
//               type="button"
//               onClick={() =>
//                 setAttributes([
//                   ...attributes,
//                   {
//                     size: "",
//                     color: "",
//                     quantity: "",
//                     price: "",
//                     buyingPrice: "",
//                   },
//                 ])
//               }
//               className="btn btn-primary btn-sm my-3 d-flex "
//               style={{ maxWidth: "200px" }}
//             >
//               Add attribute
//             </button>

//             <button
//               className=" btn btn-success btn-sm my-3 d-flex"
//               type="submit"
//             >
//               Add Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Addproduct;

import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { createProducts, resetState } from "../features/product/productSlice";
import { getSizes } from "../features/size/sizeSlice";

let schema = yup.object().shape({
  title: yup.string().min(1).max(150).required("Title is Required"),
  description: yup.string().min(1).max(500).required("Description is Required"),
  brand: yup.string().min(1).max(30).required("Brand is Required"),
  category: yup.number().required("Category is Required"),
  attributes: yup.array().required("Attribute is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  const [size, setSize] = useState([]);
  const [attributes, setAttributes] = useState([
    { size: "", color: "", quantity: "", price: "", buyingPrice: "" },
  ]);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getSizes());
  }, []);

  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const sizeState = useSelector((state) => state.size.sizes);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct } = newProduct;

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfullly!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const coloropt = [];

  colorState.forEach((i) => {
    coloropt.push({
      label: i.col_name,
      value: i.col_code,
    });
  });

  const sizeopt = [];

  sizeState.forEach((i) => {
    sizeopt.push({
      label: i.size_name,
      value: i.size_id,
    });
  });

  const handleAttributeChange = (idx, e) => {
    const { name, value } = e.target;
    const newAttributes = [...attributes];
    newAttributes[idx][name] = value;
    setAttributes(newAttributes);
  };

  useEffect(() => {
    formik.setFieldValue("images", images);
  }, [images]);

  useEffect(() => {
    formik.setFieldValue("attributes", attributes);
  }, [attributes]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      brand: "",
      category: "",
      images: [], // Add this to handle images
      attributes: [
        { size: "", color: "", quantity: 0, price: 0, buyingPrice: 0 },
      ],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("brand", values.brand);
      formData.append("category", values.category);
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i]);
      }
      formData.append("attributes", JSON.stringify(values.attributes));
      console.log(formData);
      dispatch(createProducts(formData)).then((response) => {
        console.log(response.payload.status);
        if (response.payload.status === 200) {
          toast.success("Product Added Successfully!");
          navigate("/admin/list-product");
        }
      });
      // formik.resetForm();

      // setTimeout(() => {
      //   dispatch(resetState());
      //   window.location.reload()

      // }, 2000);
    },
  });

  return (
    <div className="container">
      {" "}
      {/* Added Bootstrap container class */}
      <h3 className="mb-4 title text-center">Add Product</h3>{" "}
      {/* Added Bootstrap text-center class */}
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column p-5"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            className="form-control"
          />
          <div className="error text-danger">
            {" "}
            {/* Added Bootstrap text-danger class for error */}
            {formik.touched.title && formik.errors.title}
          </div>

          <div className="mb-3">
            <ReactQuill
              placeholder="Add Description"
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
              className="w-100"
            />
          </div>
          <div className="error text-danger">
            {" "}
            {/* Added Bootstrap text-danger class for error */}
            {formik.touched.description && formik.errors.description}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Brand"
            name="brand"
            onChng={formik.handleChange("brand")}
            onBlr={formik.handleBlur("brand")}
            val={formik.values.brand}
            className="form-control"
          />
          <div className="error text-danger">
            {" "}
            {/* Added Bootstrap text-danger class for error */}
            {formik.touched.brand && formik.errors.brand}
          </div>

          {/* Category */}
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-select py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.cat_id}>
                  {i.cat_name}
                </option>
              );
            })}
          </select>
          <div className="error text-danger">
            {" "}
            {/* Added Bootstrap text-danger class for error */}
            {formik.touched.category && formik.errors.category}
          </div>

          <div className="bg-white border border-secondary p-5 text-center">
            {/* <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}> */}
            <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="text-secondary">
                      Drag & drop some files here, or click to select files
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>

          <div className="showimages d-flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div className="position-relative" key={index}>
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((img) => img !== image))
                  }
                  className="btn-close btn-close-white position-absolute"
                  style={{ top: "10px", right: "10px" }}
                ></button>
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>

          {attributes.map((attribute, idx) => (
            <div key={idx} className="d-flex">
              <select
                name="size"
                className="form-select w-100"
                placeholder="Select Size"
                value={attribute.size}
                onChange={(e) => handleAttributeChange(idx, e)}
                required
              >
                <option value="">Select Size</option>
                {sizeState.map((i, j) => (
                  <option key={j} value={i.size_id}>
                    {i.size_name}
                  </option>
                ))}
              </select>

              <select
                name="color"
                className="form-select w-100"
                placeholder="Select Color"
                value={attribute.color}
                onChange={(e) => handleAttributeChange(idx, e)}
                required
              >
                <option value="">Select Color</option>
                {colorState.map((i, j) => (
                  <option key={j} value={i.col_code}>
                    {i.col_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={attribute.quantity}
                onChange={(e) => handleAttributeChange(idx, e)}
                min={1}
                max={100}
                required
                className="form-control w-100"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={attribute.price}
                onChange={(e) => handleAttributeChange(idx, e)}
                min={1}
                max={999999}
                required
                className="form-control w-100"
              />
              <input
                type="number"
                name="buyingPrice"
                placeholder="Purchased Price"
                value={attribute.buyingPrice}
                onChange={(e) => handleAttributeChange(idx, e)}
                min={1}
                max={999999}
                required
                className="form-control w-100"
              />

              {/* <button
                type="button"
                onClick={() =>
                  setAttributes(attributes.filter((_, i) => i !== idx))
                }
                className="btn btn-danger btn-sm"
              >
                Remove
              </button> */}

              {idx !== 0 && (
                
                <button
                  type="button"
                  onClick={() =>
                    setAttributes(attributes.filter((_, i) => i !== idx))
                  }
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              )}



            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setAttributes([
                ...attributes,
                {
                  size: "",
                  color: "",
                  quantity: "",
                  price: "",
                  buyingPrice: "",
                },
              ])
            }
            className="btn btn-primary btn-sm my-3"
          >
            Add attribute
          </button>

          <button
            className="btn btn-success btn-lg rounded-3 my-5"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;

// import { React, useEffect, useState } from "react";
// import CustomInput from "../components/CustomInput";
// import ReactQuill from "react-quill";
// import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";
// import { toast } from "react-toastify";
// import * as yup from "yup";
// import { useFormik } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { getCategories } from "../features/pcategory/pcategorySlice";
// import { getColors } from "../features/color/colorSlice";
// import { Select } from "antd";
// import Dropzone from "react-dropzone";
// import { createProducts, resetState } from "../features/product/productSlice";
// import { getSizes } from "../features/size/sizeSlice";

// let schema = yup.object().shape({
//   title: yup.string().required("Title is Required"),
//   description: yup.string().required("Description is Required"),
//   brand: yup.string().required("Brand is Required"),
//   category: yup.number().required("Category is Required"),

//   attributes: yup.array(),
// });

// const Addproduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [color, setColor] = useState([]);
//   const [images, setImages] = useState([]);
//   const [size, setSize] = useState([]);
//   const [attributes, setAttributes] = useState([
//     { size: "", color: "", quantity: '', price: '' , buyingPrice: ''}
//   ]);

//   useEffect(() => {
//     dispatch(getCategories());
//     dispatch(getColors());
//     dispatch(getSizes());
//   }, []);

//   const catState = useSelector((state) => state.pCategory.pCategories);
//   const colorState = useSelector((state) => state.color.colors);
//   const sizeState = useSelector((state) => state.size.sizes);
//   const newProduct = useSelector((state) => state.product);
//   const { isSuccess, isError, isLoading, createdProduct } = newProduct;

//   useEffect(() => {
//     if (isSuccess && createdProduct) {
//       toast.success("Product Added Successfullly!");
//     }
//     if (isError) {
//       toast.error("Something Went Wrong!");
//     }
//   }, [isSuccess, isError, isLoading]);

//   const coloropt = [];

//   colorState.forEach((i) => {
//     coloropt.push({
//       label: i.col_name,
//       value: i.col_code,
//     });
//   });

//   const sizeopt = [];

//   sizeState.forEach((i) => {
//     sizeopt.push({
//       label: i.size_name,
//       value: i.size_id,
//     });
//   });

//   const handleAttributeChange = (idx, e) => {
//     const { name, value } = e.target;
//     const newAttributes = [...attributes];
//     newAttributes[idx][name] = value;
//     setAttributes(newAttributes);
//   };

//   useEffect(() => {
//     formik.setFieldValue("images", images);
//   }, [images]);

//   useEffect(() => {
//     formik.setFieldValue("attributes", attributes);
//   }, [attributes]);

//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       description: "",
//       brand: "",
//       category: "",
//       images: [], // Add this to handle images
//       attributes: [{ size: "", color: "", quantity: 0, price: 0 , buyingPrice: 0}],
//     },
//     validationSchema: schema,

//     onSubmit: (values) => {
//       const formData = new FormData();
//       formData.append("title", values.title);
//       formData.append("description", values.description);
//       formData.append("brand", values.brand);
//       formData.append("category", values.category);

//       for (let i = 0; i < values.images.length; i++) {
//         formData.append("images", values.images[i]);
//       }
//       formData.append("attributes", JSON.stringify(values.attributes));
//       console.log(formData);
//       // let x = JSON.stringify(values.attributes);
//       // console.log(values.attributes);
//       // console.log(attributes);
//       dispatch(createProducts(formData));
//       // formik.resetForm();
//       // setColor(null);
//       // setTimeout(() => {
//       //   dispatch(resetState());
//       // }, 3000);
//     },
//   });

//   return (
//     <div>
//       <h3 className="mb-4 title">Add Product</h3>
//       <div>
//         <form
//           onSubmit={formik.handleSubmit}
//           className="d-flex gap-3 flex-column"
//         >
//           <CustomInput
//             type="text"
//             label="Enter Product Title"
//             name="title"
//             onChng={formik.handleChange("title")}
//             onBlr={formik.handleBlur("title")}
//             val={formik.values.title}
//           />
//           <div className="error">
//             {formik.touched.title && formik.errors.title}
//           </div>
//           <div className="">
//             <ReactQuill
//               theme="snow"
//               name="description"
//               onChange={formik.handleChange("description")}
//               value={formik.values.description}
//             />
//           </div>
//           <div className="error">
//             {formik.touched.description && formik.errors.description}
//           </div>

//           <CustomInput
//             type="text"
//             label="Enter Product Brand"
//             name="brand"
//             onChng={formik.handleChange("brand")}
//             onBlr={formik.handleBlur("brand")}
//             val={formik.values.brand}

//           />

//           <div className="error">
//             {formik.touched.brand && formik.errors.brand}
//           </div>

//           {/* Category */}
//           <select
//             name="category"
//             onChange={formik.handleChange("category")}
//             onBlur={formik.handleBlur("category")}
//             value={formik.values.category}
//             className="form-control py-3 mb-3"
//             id=""
//           >
//             <option value="">Select Category</option>
//             {catState.map((i, j) => {
//               return (
//                 <option key={j} value={i.cat_id}>
//                   {i.cat_name}
//                 </option>
//               );
//             })}
//           </select>
//           <div className="error">
//             {formik.touched.category && formik.errors.category}
//           </div>

//           <div className="bg-white border-1 p-5 text-center">
//             {/* <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}> */}
//             <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}>
//               {({ getRootProps, getInputProps }) => (
//                 <section>
//                   <div {...getRootProps()}>
//                     <input {...getInputProps()} />
//                     <div >Drag & drop some files here, or click to select files</div>
//                   </div>
//                 </section>
//               )}
//             </Dropzone>
//           </div>

//           <div className="showimages d-flex flex-wrap gap-3">
//             {images.map((image, index) => (
//               <div className="position-relative" key={index}>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setImages(images.filter((img) => img !== image))
//                   }
//                   className="btn-close position-absolute"
//                   style={{ top: "10px", right: "10px" }}
//                 ></button>
//                 <img
//                   src={URL.createObjectURL(image)}
//                   alt=""
//                   width={200}
//                   height={200}
//                 />
//               </div>
//             ))}
//           </div>

//           {attributes.map((attribute, idx) => (
//             <div key={idx} className="d-flex">
//               <select
//                 name="size"
//                 className="w-100"
//                 placeholder="Select Size"
//                 value={attribute.size}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 required
//               >
//                 <option value="">Select Size</option>
//                 {sizeState.map((i, j) => (
//                   <option key={j} value={i.size_id}>
//                     {i.size_name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="color"
//                 className="w-100"
//                 placeholder="Select Color"
//                 value={attribute.color}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 required
//               >
//                 <option value="">Select Color</option>
//                 {colorState.map((i, j) => (
//                   <option key={j} value={i.col_code}>
//                     {i.col_name}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="number"
//                 name="quantity"
//                 placeholder="Quantity"
//                 value={attribute.quantity}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 min={1}
//                 max={100}
//                 required
//               />
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={attribute.price}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 min={1}
//                 max={1000000}
//                 required
//               />
//               <input
//                 type="number"
//                 name="buyingPrice"
//                 placeholder="Purchased Price"
//                 value={attribute.buyingPrice}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//                 min={1}
//                 max={1000000}
//                 required
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAttributes(attributes.filter((_, i) => i !== idx))
//                 }
//               >

//                 Remove
//               </button>
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={() =>
//               setAttributes([
//                 ...attributes,
//                 {
//                   size: "",
//                   color: "",
//                   quantity: 0,
//                   price: 0,
//                   buyingPrice: 0
//                 },
//               ])
//             }
//           >
//             Add attribute
//           </button>

//           <button
//             className="btn btn-success border-0 rounded-3 my-5"
//             type="submit"
//           >
//             Add Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Addproduct;

// import { React, useEffect, useState } from "react";
// import CustomInput from "../components/CustomInput";
// import ReactQuill from "react-quill";
// import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";
// import { toast } from "react-toastify";
// import * as yup from "yup";
// import { useFormik } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { getCategories } from "../features/pcategory/pcategorySlice";
// import { getColors } from "../features/color/colorSlice";
// import { Select } from "antd";
// import Dropzone from "react-dropzone";
// import { createProducts, resetState } from "../features/product/productSlice";
// import { getSizes } from "../features/size/sizeSlice";

// let schema = yup.object().shape({
//   title: yup.string().required("Title is Required"),
//   description: yup.string().required("Description is Required"),
//   brand: yup.string().required("Brand is Required"),
//   category: yup.number().required("Category is Required"),

//   attributes: yup.array(),
// });

// const Addproduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [color, setColor] = useState([]);
//   const [images, setImages] = useState([]);
//   const [size, setSize] = useState([]);
//   const [attributes, setAttributes] = useState([
//     { size: "", color: "", quantity: 0, price: 0 },
//   ]);

//   useEffect(() => {
//     dispatch(getCategories());
//     dispatch(getColors());
//     dispatch(getSizes());
//   }, []);

//   const catState = useSelector((state) => state.pCategory.pCategories);
//   const colorState = useSelector((state) => state.color.colors);
//   const sizeState = useSelector((state) => state.size.sizes);
//   const newProduct = useSelector((state) => state.product);
//   const { isSuccess, isError, isLoading, createdProduct } = newProduct;

//   useEffect(() => {
//     if (isSuccess && createdProduct) {
//       toast.success("Product Added Successfullly!");
//     }
//     if (isError) {
//       toast.error("Something Went Wrong!");
//     }
//   }, [isSuccess, isError, isLoading]);

//   const coloropt = [];

//   colorState.forEach((i) => {
//     coloropt.push({
//       label: i.col_name,
//       value: i.col_code,
//     });
//   });

//   const sizeopt = [];

//   sizeState.forEach((i) => {
//     sizeopt.push({
//       label: i.size_name,
//       value: i.size_id,
//     });
//   });

//   const handleAttributeChange = (idx, e) => {
//     const { name, value } = e.target;
//     const newAttributes = [...attributes];
//     newAttributes[idx][name] = value;
//     setAttributes(newAttributes);
//   };

//   useEffect(() => {
//     formik.setFieldValue("images", images);
//   }, [images]);

//   useEffect(() => {
//     formik.setFieldValue("attributes", attributes);
//   }, [attributes]);

//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       description: "",
//       brand: "",
//       category: "",
//       images: [], // Add this to handle images
//       attributes: [{ size: "", color: "", quantity: 0, price: 0 }],
//     },
//     validationSchema: schema,

//     onSubmit: (values) => {
//       const formData = new FormData();
//       formData.append("title", values.title);
//       formData.append("description", values.description);
//       formData.append("brand", values.brand);
//       formData.append("category", values.category);

//       for (let i = 0; i < values.images.length; i++) {
//         formData.append("images", values.images[i]);
//       }
//       formData.append("attributes", JSON.stringify(values.attributes));
//       console.log(formData);
//       // let x = JSON.stringify(values.attributes);
//       // console.log(values.attributes);
//       // console.log(attributes);
//       dispatch(createProducts(formData));
//       // formik.resetForm();
//       // setColor(null);
//       // setTimeout(() => {
//       //   dispatch(resetState());
//       // }, 3000);
//     },
//   });

//   return (
//     <div>
//       <h3 className="mb-4 title">Add Product</h3>
//       <div>
//         <form
//           onSubmit={formik.handleSubmit}
//           className="d-flex gap-3 flex-column"
//         >
//           <CustomInput
//             type="text"
//             label="Enter Product Title"
//             name="title"
//             onChng={formik.handleChange("title")}
//             onBlr={formik.handleBlur("title")}
//             val={formik.values.title}
//           />
//           <div className="error">
//             {formik.touched.title && formik.errors.title}
//           </div>
//           <div className="">
//             <ReactQuill
//               theme="snow"
//               name="description"
//               onChange={formik.handleChange("description")}
//               value={formik.values.description}
//             />
//           </div>
//           <div className="error">
//             {formik.touched.description && formik.errors.description}
//           </div>

//           <CustomInput
//             type="text"
//             label="Enter Product Brand"
//             name="brand"
//             onChng={formik.handleChange("brand")}
//             onBlr={formik.handleBlur("brand")}
//             val={formik.values.brand}
//           />

//           <div className="error">
//             {formik.touched.brand && formik.errors.brand}
//           </div>

//           {/* Category */}
//           <select
//             name="category"
//             onChange={formik.handleChange("category")}
//             onBlur={formik.handleBlur("category")}
//             value={formik.values.category}
//             className="form-control py-3 mb-3"
//             id=""
//           >
//             <option value="">Select Category</option>
//             {catState.map((i, j) => {
//               return (
//                 <option key={j} value={i.cat_id}>
//                   {i.cat_name}
//                 </option>
//               );
//             })}
//           </select>
//           <div className="error">
//             {formik.touched.category && formik.errors.category}
//           </div>

//           <div className="bg-white border-1 p-5 text-center">
//             {/* <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}> */}
//             <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}>
//               {({ getRootProps, getInputProps }) => (
//                 <section>
//                   <div {...getRootProps()}>
//                     <input {...getInputProps()} />
//                     <p>Drag & drop some files here, or click to select files</p>
//                   </div>
//                 </section>
//               )}
//             </Dropzone>
//           </div>

//           <div className="showimages d-flex flex-wrap gap-3">
//             {images.map((image, index) => (
//               <div className="position-relative" key={index}>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setImages(images.filter((img) => img !== image))
//                   }
//                   className="btn-close position-absolute"
//                   style={{ top: "10px", right: "10px" }}
//                 ></button>
//                 <img
//                   src={URL.createObjectURL(image)}
//                   alt=""
//                   width={200}
//                   height={200}
//                 />
//               </div>
//             ))}
//           </div>

//           {attributes.map((attribute, idx) => (
//             <div key={idx} className="d-flex">
//               <select
//                 name="size"
//                 className="w-100"
//                 placeholder="Select Size"
//                 value={attribute.size}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//               >
//                 <option value="">Select Size</option>
//                 {sizeState.map((i, j) => (
//                   <option key={j} value={i.size_id}>
//                     {i.size_name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="color"
//                 className="w-100"
//                 placeholder="Select Color"
//                 value={attribute.color}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//               >
//                 <option value="">Select Color</option>
//                 {colorState.map((i, j) => (
//                   <option key={j} value={i.col_code}>
//                     {i.col_name}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="number"
//                 name="quantity"
//                 placeholder="Quantity"
//                 value={attribute.quantity}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//               />
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={attribute.price}
//                 onChange={(e) => handleAttributeChange(idx, e)}
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAttributes(attributes.filter((_, i) => i !== idx))
//                 }
//               >
//                 Remove
//               </button>
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={() =>
//               setAttributes([
//                 ...attributes,
//                 {
//                   size: "",
//                   color: "",
//                   quantity: 0,
//                   price: 0,
//                 },
//               ])
//             }
//           >
//             Add attribute
//           </button>

//           <button
//             className="btn btn-success border-0 rounded-3 my-5"
//             type="submit"
//           >
//             Add Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Addproduct;
