import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import {
  updateProduct,
  resetState,
  getSingleProduct,
} from "../features/product/productSlice";
import { getSizes } from "../features/size/sizeSlice";
import axios from "axios";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  const [size, setSize] = useState([]);
  const [attributes, setAttributes] = useState([
    { size: "", color: "", quantity: 0, price: 0, buyingPrice: 0 },
  ]);
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];

  useEffect(() => {
    dispatch(getSingleProduct(getProductId));
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getSizes());
  }, []);

  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const sizeState = useSelector((state) => state.size.sizes);
  const productState = useSelector((state) => state.product.singleProduct);
  console.log(productState);
  // const { isSuccess, isError, isLoading } = productState;

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getSizes());

    // Fetch product data from your Redux store or API and set form fields
    if (productState) {
      formik.setFieldValue("title", productState.p_title);
      formik.setFieldValue("description", productState.p_description);
      formik.setFieldValue("brand", productState.brand);
      formik.setFieldValue("category", productState.category_id);
      // Set other form fields as needed
      setAttributes(
        productState.size_color_quantity.map((item) => ({
          size: item.size_id,
          color: item.color_code,
          quantity: item.quantity,
          price: item.unit_price,
          buyingPrice: item.buyingPrice,
          barcode: item.barcode,
        }))
      );
    }
  }, [productState]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success("Product Updated Successfully!");
  //     // navigate("/admin/products");
  //   }
  //   if (isError) {
  //     toast.error("Something Went Wrong!");
  //   }
  // }, [isSuccess, isError, isLoading, navigate]);

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

  let schema = yup.object().shape({
    title: yup.string().min(1).max(150).required("Title is Required"),
    description: yup
      .string()
      .min(1)
      .max(500)
      .required("Description is Required"),
    brand: yup.string().min(1).max(30).required("Brand is Required"),
    category: yup.number().required("Category is Required"),
    attributes: yup.array().required("Attribute is Required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      brand: "",
      category: "",
      images: [],
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
      dispatch(updateProduct({ id, formData })).then((res) => {
        console.log(res);
        if (res.payload.status == 200) {
          toast.success("Product Updated Successfully!");
          navigate("/admin/list-product");
        }
      });
      // alert({values});
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">Edit Product</h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>

          <div className="bg-white">
            <label className="" style={{ fontWeight: "" }}>
              Product Description:{" "}
            </label>
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Brand"
            name="brand"
            onChng={formik.handleChange("brand")}
            onBlr={formik.handleBlur("brand")}
            val={formik.values.brand}
          />

          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>

          {/* Category */}
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
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
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>

          <div className="existing-images d-flex flex-wrap gap-3">
            {productState &&
              productState.images.map((image, index) => (
                <div className="position-relative" key={index}>
                  <img src={image.image_link} alt="" width={200} height={200} />
                </div>
              ))}
          </div>

          <div className="bg-white border-1 p-5 text-center">
            {/* <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}> */}
            <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag & drop some files here, or click to select files</p>
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
                  className="btn-close position-absolute"
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
                className="form-control w-100"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={attribute.price}
                min={1}
                max={999999}
                onChange={(e) => handleAttributeChange(idx, e)}
                className="form-control w-100"
                required
              />
              <input
                type="number"
                name="buyingPrice"
                placeholder="buyingPrice"
                value={attribute.buyingPrice}
                min={1}
                max={999999}
                onChange={(e) => handleAttributeChange(idx, e)}
                className="form-control w-100"
              />

              <button
                type="button"
                onClick={() =>
                  setAttributes(attributes.filter((_, i) => i !== idx))
                }
                className="btn btn-danger btn-sm"
              >
                Remove
              </button>

              <div className="px-2 bg-light d-flex justify-content-between align-items-center rounded p-2">
                <strong>BarCode:</strong>
                <span>{attribute.barcode}</span>
              </div>
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
                  quantity: 0,
                  price: 0,
                  buyingPrice: 0,
                },
              ])
            }
            className="btn btn-primary btn-sm my-3"
          >
            Add attribute
          </button>

          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
