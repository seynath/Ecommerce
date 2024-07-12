import React, { useEffect, useState } from "react";

import { Table } from "antd";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal.jsx";
import axios from "axios";
import { base_url } from "../utils/baseUrl.jsx";
import { config } from "../utils/axiosconfig.jsx";

const columns = [
  {
    title: "Enquiry ID",
    dataIndex: "enquiry_id",
    sorter: (a, b) => a.enquiry_id - b.enquiry_id,
    defaultSortOrder: 'descend',
  },
  {
    title: "Order ID",
    dataIndex: "order_id",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
  },
  {
    title: "Enquiry MEssage",
    dataIndex: "message",
  },
  {
    title: "Enquiry Status",
    dataIndex: "status",
  },

  {
    title: "Action",
    dataIndex: "action",
  },
];

const Enquiries = () => {
  const [open, setOpen] = useState(false);
  const [enqId, setenqId] = useState("");
  const [enqState, setEnqState] = useState([]);
  const showModal = (e) => {
    setOpen(true);
    setenqId(e);
  };

  const EnquiriesList = async (orderId) => {
    try {
      const response = await axios.get(`${base_url}enquiry/`);
      console.log(response.data);

      if (response.data) {
        setEnqState(response.data);
      } else {
        // Handle error
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  const hideModal = () => {
    setOpen(false);
  };
 
  const data1 = [];
  for (let i = 0; i < enqState.length; i++) {
    data1.push({
      // key: i + 1,
      enquiry_id: enqState[i].enquiry_id,
      order_id: enqState[i].order_id,
      message: enqState[i].enquiry_message,
      email: enqState[i].email,
      mobile: enqState[i].mobile,
      status: (
        <>
          <select
            name=""
            defaultValue={
              enqState[i].enquiry_status
                ? enqState[i].enquiry_status
                : "Submitted"
            }
            className="form-control form-select"
            id=""
            onChange={(e) =>
              setEnquiryStatus(e.target.value, enqState[i].enquiry_id)
            }
          >
            <option value="Submitted">Submitted</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </>
      ),

      action: (
        <>
          {/* <Link
            className="ms-3 fs-3 text-danger"
            to={`/admin/enquiries/${enqState[i].enquiry_id}`}
          >
            <AiOutlineEye />
          </Link> */}
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(enqState[i].enquiry_id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }

  const changeStatus = async (data) => {
    try {
      const response = await axios.post(
        `${base_url}enquiry/change-status`,
        data
      );
      console.log(response);

      if (response.status === 204) {
      } else {
        // Handle error
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };
  const setEnquiryStatus = (e, i) => {
    console.log(e, i);
    const data = { id: i, enqData: e };
    changeStatus(data);
    // dispatch(updateAEnquiry(data));
  };

  const deleteEnq = (id) => {
    // dispatch(deleteAEnquiry(e));
    console.log(id);
    axios.delete(`${base_url}enquiry/${id}`, config).then((response) => {
      console.log(response);
      if (response.status === 204) {
        console.log("Deleted");
        //refresh
        window.location.reload()
        


        // EnquiriesList();
      } else {
        // Handle error
      }
    });

    setOpen(false);
    setTimeout(() => {}, 100);
  };


  useEffect(() => {
    // dispatch(resetState());
    // dispatch(getEnquiries());
    EnquiriesList();
  }, []);
  return (
    <div>
      <h3 className="mb-4 title">Enquiries</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteEnq(enqId);
        }}
        title="Are you sure you want to delete this enquiry?"
      />
    </div>
  );
};

export default Enquiries;
