import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig"


const Profile = () => {
  const [userData, setUserData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const fetchUser = async () => {
    let id = user._id;
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
      <div class1="login-wrapper py-5 home-wrapper-2">
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
      </div>
    </>
  );
};

export default Profile;