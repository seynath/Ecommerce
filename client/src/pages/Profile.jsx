import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url, config } from "../utils/axiosConfig";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const fetchUser = async () => {
    let id = user.id;
    await axios
      .get(`${base_url}user/${id}`, config)
      .then((response) => {
        console.log(response.data);
        setUserData(response.data); 
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = async (values) => {
    let id = user.id;
    const data = {
      firstname: values.firstname,
      lastname: values.lastname,
      mobile: values.mobile,
      email: values.email,
    };
    await axios
      .put(`${base_url}user/edit-user`, data, config)
      .then((response) => {
        console.log(response.data);
        toast.success("Profile updated successfully");
        fetchUser(); // Refetch user data after update
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Meta title="Profile" />
      <BreadCrumb title="Profile" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Update Profile</h3>
              {userData && (
                <Formik
                  initialValues={{
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    mobile: userData.mobile,
                    email: userData.email,
                  }}
                  validationSchema={Yup.object({
                    firstname: Yup.string()
                      .required("Required")
                      .min(3, "Must be at least 3 characters"),
                    lastname: Yup.string()
                      .required("Required")
                      .min(3, "Must be at least 3 characters"),
                    mobile: Yup.string()
                      .required("Required")
                      .min(10, "Must be at least 10 characters"),
                    email: Yup.string()
                      .email("Invalid email address")
                      .required("Required"),
                  })}
                  onSubmit={handleUpdate}
                >
                  {(formikProps) => (
                    <Form>
                      <div className="form-group">
                        <label htmlFor="firstname" className="form-label">
                          First Name:
                        </label>
                        <Field
                          type="text"
                          name="firstname"
                          className="form-control"
                          placeholder="First Name"
                        />
                        <ErrorMessage
                          name="firstname"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastname" className="form-label">
                          Last Name:
                        </label>
                        <Field
                          type="text"
                          name="lastname"
                          className="form-control"
                          placeholder="Last Name"
                        />
                        <ErrorMessage
                          name="lastname"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="mobile" className="form-label">
                          Mobile:
                        </label>
                        <Field
                          type="text"
                          name="mobile"
                          className="form-control"
                          placeholder="Mobile"
                        />
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          Email:
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <button type="submit" className="button border-0 mt-2">
                        Update
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;

// Your existing components: CustomInput, Container, BreadCrumb, Meta

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { base_url, config } from "../utils/axiosConfig";

// const Profile = () => {
//   // State variables to store user profile data
//   const [firstname, setFirstName] = useState("");
//   const [lastname, setLastName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");


//   const user = JSON.parse(localStorage.getItem("user"));
//   console.log(user);

//   const fetchUser = async () => {
//     let id = user.id;
//     await axios
//       .get(`${base_url}user/${id}`, config)
//       .then((response) => {
//         console.log(response.data);
//         setFirstName(response.data.firstname);
//         setLastName(response.data.lastname);
//         setMobile(response.data.mobile);
//         setEmail(response.data.email);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   // Function to handle profile update
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     let id = user.id;
//     const data = {
//       firstname: firstname,
//       lastname: lastname,
//       mobile: mobile,
//       email: email,
//     };
//     await axios
//       .put(`${base_url}user/edit-user`, data, config)
//       .then((response) => {
//         console.log(response.data);
//         alert("Profile updated successfully");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <div>
//       <h1>User Profile</h1>
//       <form
//       onSubmit={handleUpdate}
//       >
//       <label>
//         First Name:
//         <input
//           type="text"
//           value={firstname}
//           onChange={(e) => setFirstName(e.target.value)}
//           min={3}
//           required
//         />
//       </label>
//       <br />
//       <label>
//         Last Name:
//         <input
//           type="text"
//           value={lastname}
//           onChange={(e) => setLastName(e.target.value)}
//           min={3}
//           required
//         />
//       </label>
//       <br />
//       <label>
//         Mobile:
//         <input
//           type="text"
//           value={mobile}
//           onChange={(e) => setMobile(e.target.value)}
//           min={10}
//           required
//         />
//       </label>
//        <br />
//       <label>
//         Email:
//         <input
//           type="email"
//           value={email}
          
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </label>
//       <br />

     
//       <br />
//       <button type="submit">Update</button>
//     </form>
//     </div>
//   );
// };

// export default Profile;
