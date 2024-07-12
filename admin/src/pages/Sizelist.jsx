import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteASize,
  getSizes,
  resetState,
} from "../features/size/sizeSlice";
import CustomModal from "../components/CustomModal";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Sizelist = () => {



  const [open, setOpen] = useState(false);
  const [sizeId, setSizeId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setSizeId(e);
  };


  const deleteSize = async(e) =>{
    const id = e;
    await axios.delete(`${base_url}size/${id}`,config)
    .then(
      (response)=>{
        console.log(response.data);
        setOpen(false);
        setTimeout(() => {
          dispatch(getSizes());
        }, 100);
      }
    ).catch(
      (error)=>{
        console.log(error);
      }
    )


  }
  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getSizes());
  }, []);
  const sizeState = useSelector((state) => state.size.sizes);
  console.log(sizeState);
  const data1 = [];
  for (let i = 0; i < sizeState.length; i++) {
    data1.push({
      key: sizeState[i].size_id,
      name: sizeState[i].size_name,
      action: (
        <>
          <Link
            to={`/admin/edit-size/${sizeState[i].size_id}`}
            className=" fs-3 text-danger"
          >
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(sizeState[i].size_id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }


  return (
    <div>
      <h3 className="mb-4 title">Sizes</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteSize(sizeId);
        }}
        title="Are you sure you want to delete this brand?"
      />
    </div>
  );
};

export default Sizelist;





// import React, { useEffect, useState } from "react";
// import { Table } from "antd";
// import { BiEdit } from "react-icons/bi";
// import { AiFillDelete } from "react-icons/ai";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   deleteASize,
//   getSizes,
//   resetState,
// } from "../features/size/sizeSlice";
// import CustomModal from "../components/CustomModal";
// import axios from "axios";
// import { base_url } from "../utils/baseUrl";
// import { config } from "../utils/axiosconfig";

// const columns = [
//   {
//     title: "SNo",
//     dataIndex: "key",
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

// const Sizelist = () => {
//   const [open, setOpen] = useState(false);
//   const [sizeId, setSizeId] = useState("");
//   const showModal = (e) => {
//     setOpen(true);
//     setSizeId(e);
//   };


//   const deleteSize = async(e) =>{
//     const id = e;
//     await axios.delete(`${base_url}size/${id}`,config)
//     .then(
//       (response)=>{
//         console.log(response.data);
//         setOpen(false);
//         setTimeout(() => {
//           dispatch(getSizes());
//         }, 100);
//       }
//     ).catch(
//       (error)=>{
//         console.log(error);
//       }
//     )


//   }
//   const hideModal = () => {
//     setOpen(false);
//   };
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(resetState());
//     dispatch(getSizes());
//   }, []);
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
//             className=" fs-3 text-danger"
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

//   // const deleteSize = (e) => {
//   //   console.log(e);
//   //   // dispatch(deleteASize(e));

//   //   setOpen(false);
//   //   setTimeout(() => {
//   //     dispatch(getSizes());
//   //   }, 100);
//   // };
//   return (
//     <div>
//       <h3 className="mb-4 title">Sizes</h3>
//       <div>
//         <Table columns={columns} dataSource={data1} />
//       </div>
//       <CustomModal
//         hideModal={hideModal}
//         open={open}
//         performAction={() => {
//           deleteSize(sizeId);
//         }}
//         title="Are you sure you want to delete this brand?"
//       />
//     </div>
//   );
// };

// export default Sizelist;
