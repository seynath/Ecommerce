import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { base_url } from "../utils/baseUrl";
import axios from "axios";
import { config } from "../utils/axiosconfig";

const Customers = () => {
  const [customerstate, setCustomerState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({}); // Initialize as an object

  const fetchUsers = async () => {
    await axios
      .get(`${base_url}user/all-users`)
      .then(
        (response) => {
          console.log(response);
          setCustomerState(response.data);
        },
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const data1 = [];
  for (let i = 0; i < customerstate.length; i++) {
    if (customerstate[i].role !== "") {
      data1.push({
        key: i + 1,
        name: customerstate[i].firstname + " " + customerstate[i].lastname,
        email: customerstate[i].email,
        mobile: customerstate[i].mobile,
        id: customerstate[i].id,
        rolenumber: customerstate[i].role,
        role: customerstate[i].role,
      });
    }
  }

  const filteredData = data1.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.key.toString().includes(searchQuery)
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = async (e, userId) => {
    setSelectedRoles({ ...selectedRoles, [userId]: e.target.value }); // Update the role for the specific user

    await axios
      .put(`${base_url}user/role-change`, { selectedRole: e.target.value, userId }, config)
      .then(
        (response) => {
          console.log(response);
          fetchUsers();
        },
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4 title">Customers</h3>
      <input
        type="text"
        placeholder="Search by name, email or ID"
        value={searchQuery}
        onChange={handleSearch}
        className="form-control mb-4"
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>SNo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.key}>
              <td>{item.key}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.mobile}</td>
              <td>{item.rolenumber}</td>
              <td>
                <select
                  required
                  value={selectedRoles[item.id] || item.rolenumber} // Use the role from the selectedRoles object or the original role
                  onChange={(e) => handleRoleChange(e, item.id)}
                >
                  <option value="user">User</option>
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;


// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getUsers } from "../features/cutomers/customerSlice";

// const Customers = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getUsers());
//   }, []);

//   const customerstate = useSelector((state) => state.customer.customers);
//   const data1 = [];
//   for (let i = 0; i < customerstate.length; i++) {
//     if (customerstate[i].role !== "admin") {
//       data1.push({
//         key: i + 1,
//         name: customerstate[i].firstname + " " + customerstate[i].lastname,
//         email: customerstate[i].email,
//         mobile: customerstate[i].mobile,
//       });
//     }
//   }

//   return (
//     <div className="container mt-5">
//       <h3 className="mb-4 title">Customers</h3>
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>SNo</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Mobile</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data1.map((item) => (
//             <tr key={item.key}>
//               <td>{item.key}</td>
//               <td>{item.name}</td>
//               <td>{item.email}</td>
//               <td>{item.mobile}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Customers;





// import React, { useEffect } from "react";
// import { Table } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { getUsers } from "../features/cutomers/customerSlice";
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
//     title: "Email",
//     dataIndex: "email",
//   },
//   {
//     title: "Mobile",
//     dataIndex: "mobile",
//   },
// ];

// const Customers = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getUsers());
//   }, []);
//   const customerstate = useSelector((state) => state.customer.customers);
//   const data1 = [];
//   for (let i = 0; i < customerstate.length; i++) {
//     if (customerstate[i].role !== "admin") {
//       data1.push({
//         key: i + 1,
//         name: customerstate[i].firstname + " " + customerstate[i].lastname,
//         email: customerstate[i].email,
//         mobile: customerstate[i].mobile,
//       });
//     }
//   }

//   return (
//     <div>
//       <h3 className="mb-4 title">Customers</h3>
//       <div>
//         <Table columns={columns} dataSource={data1} />
//       </div>
//     </div>
//   );
// };

// export default Customers;
