// import { React, useEffect, useState } from "react";
// import CustomInput from "../components/CustomInput";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as yup from "yup";
// import { useFormik } from "formik";
// import {
//   createSize,
//   getASize,
//   resetState,
//   updateASize,
//   getSizes,
// } from "../features/size/sizeSlice";
// import { Table } from "antd";
// import { BiEdit } from "react-icons/bi";
// import { AiFillDelete } from "react-icons/ai";
// import { Link } from "react-router-dom";
// import CustomModal from "../components/CustomModal";
// import axios from "axios";
// import { base_url } from "../utils/baseUrl";
// import { config } from "../utils/axiosconfig";

// let schema = yup.object().shape({
//   title: yup.string().min(1).max(10).required("Size is Required"),
// });

// const columns = [
//   {
//     title: "Size ID",
//     dataIndex: "key",
//     sorter:(a, b) => b.size_id - a.size_id,
//     defaultSortOrder: 'descend',

//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//     sorter: (a, b) => a.name.length - b.name.length,
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//   },
// ];

// const AddSize = () => {
//   const [open, setOpen] = useState(false);
//   const [sizeId, setSizeId] = useState("");
//   const showModal = (e) => {
//     setOpen(true);
//     setSizeId(e);
//   };

//   const deleteSize = async (e) => {
//     const id = e;
//     await axios.delete(`${base_url}size/${id}`, config)
//       .then((response) => {
//         console.log(response.data);
//         setOpen(false);
//         setTimeout(() => {
//           dispatch(getSizes());
//         }, 100);
//       }).catch((error) => {
//         console.log(error);
//       });
//   };

//   const hideModal = () => {
//     setOpen(false);
//   };

//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(resetState());
//     dispatch(getSizes());
//   }, [dispatch]);

//   const sizeState = useSelector((state) => state.size.sizes);
//   console.log(sizeState);
//   const data1 = [];
//   for (let i = 0; i < sizeState.length; i++) {
//     data1.push({
//       key: sizeState[i].size_id,
//       name: sizeState[i].size_name,
//       action: (
//         <>
//           <Link
//             to={`/admin/edit-size/${sizeState[i].size_id}`}
//             className="fs-3 text-danger"
//           >
//             <BiEdit />
//           </Link>
//           <button
//             className="ms-3 fs-3 text-danger bg-transparent border-0"
//             onClick={() => showModal(sizeState[i].size_id)}
//           >
//             <AiFillDelete />
//           </button>
//         </>
//       ),
//     });
//   }

//   const location = useLocation();
//   const navigate = useNavigate();
//   const getSizeId = location.pathname.split("/")[3];
//   const newSize = useSelector((state) => state.size);
//   const { isSuccess, isError, isLoading, createdSize, sizeName, updatedSize } = newSize;

//   useEffect(() => {
//     if (getSizeId !== undefined) {
//       dispatch(getASize(getSizeId));
//     } else {
//       dispatch(resetState());
//     }
//   }, [getSizeId, dispatch]);

//   useEffect(() => {
//     if (isSuccess && createdSize) {
//       toast.success("Size Added Successfully!");
//       dispatch(getSizes()); // Refresh the sizes list after a new size is added
//     }
//     if (isSuccess && updatedSize) {
//       toast.success("Size Updated Successfully!");
//       navigate("/admin/list-size");
//     }
//     if (isError) {
//       toast.error("Something Went Wrong!");
//     }
//   }, [isSuccess, isError, isLoading, createdSize, updatedSize, dispatch, navigate]);

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       title: sizeName || "",
//     },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       if (getSizeId !== undefined) {
//         const data = { id: getSizeId, sizeData: values };
//         dispatch(updateASize(data));
//         dispatch(resetState());
//       } else {
//         dispatch(createSize(values));
//         formik.resetForm();
//         setTimeout(() => {
//           dispatch(resetState());
//         }, 300);
//       }
//     },
//   });

//   return (
//     <div>
//       <h3 className="mb-4 title">
//         {getSizeId !== undefined ? "Edit" : "Add"} Size
//       </h3>
//       <div>
//         <form action="" onSubmit={formik.handleSubmit}>
//           <CustomInput
//             type="text"
//             name="title"
//             onChng={formik.handleChange("title")}
//             onBlr={formik.handleBlur("title")}
//             val={formik.values.title}
//             label="Enter Size"
//             id="size"
//           />
//           <div className="error">
//             {formik.touched.title && formik.errors.title}
//           </div>
//           <button
//             className="btn btn-success border-0 rounded-3 my-5"
//             type="submit"
//           >
//             {getSizeId !== undefined ? "Edit" : "Add"} Size
//           </button>
//         </form>
//         <div>
//           <h3 className="mb-4 title">Sizes</h3>
//           <div>
//             <Table columns={columns} dataSource={data1} />
//           </div>
//           <CustomModal
//             hideModal={hideModal}
//             open={open}
//             performAction={() => {
//               deleteSize(sizeId);
//             }}
//             title="Are you sure you want to delete this size?"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSize;



import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createSize,
  getASize,
  resetState,
  updateASize,
} from "../features/size/sizeSlice";

let schema = yup.object().shape({
  title: yup.string().min(1).max(10).required("Size is Required"),
});
const AddSize = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getSizeId = location.pathname.split("/")[3];
  const newSize = useSelector((state) => state.size);
  const {
    isSuccess,
    isError,
    isLoading,
    createdSize,
    sizeName,
    updatedSize,
  } = newSize;
  useEffect(() => {
    if (getSizeId !== undefined) {
      dispatch(getASize(getSizeId));
    } else {
      dispatch(resetState());
    }
  }, [getSizeId]);

  useEffect(() => {
    if (isSuccess && createdSize) {
      toast.success("Size Added Successfullly!");
    }
    if (isSuccess && updatedSize) {
      toast.success("Size Updated Successfullly!");
      navigate("/admin/list-size");
    }

    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: sizeName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getSizeId !== undefined) {
        const data = { id: getSizeId, sizeData: values };
        dispatch(updateASize(data));
        dispatch(resetState());
      } else {
        dispatch(createSize(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getSizeId !== undefined ? "Edit" : "Add"} Size
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Enter Size"
            id="size"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getSizeId !== undefined ? "Edit" : "Add"} Size
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSize;
