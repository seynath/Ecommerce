import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {toast} from "react-toastify";
import {registerUser} from "../features/user/userSlice";
import { base_url } from "../utils/axiosConfig";
import axios from "axios";
import { useState } from "react";




const Signup = () => {
const dispatch = useDispatch();
const navigate = useNavigate()

  const schema = Yup.object().shape({
    firstname: Yup.string().min(3).required("Name is required"),
    lastname: Yup.string().min(3).required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    // mobile: Yup.number()
    // .test('len', 'Mobile number must be exactly 10 digits', (val) => val && val.toString().length === 10)
    // .test('is-positive-integer', 'Mobile number must be a positive integer', (val) => val && /^\d+$/.test(val))
    // .required('Mobile number is required'),
    mobile: Yup.string().required("Mobile number is required")
.matches(
      /^[0-9]{10}$/,
      "Mobile number must be exactly 10 digits"
    )
    .test(
      "is-positive-integer",
      "Mobile number must be a positive integer",
      (val) => val && /^\d+$/.test(val)
    ),

    password: Yup.string().min(8).required("Password is required"),
  });

  const registerUser =async(values) =>{
      axios.post(`${base_url}user/register`, values)
      .then(
        (res)=>{
          if(res.status == 201){
            toast.success(res.data.message)
            navigate('/login')
          }else{
          }

          
        }
      ).catch(
        (error)=>{
          toast.error("Server Error")
        }
      )
      
      
  
  }

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
      // dispatch(registerUser(values))
      // .then(
      //   (res)=>{
      //     toast.success(res.payload.message)
      //   },
      //   navigate('/login')
      // )
      registerUser(values)

    },
  });
  return (
    <>
      <Meta title={"Sign Up"} />
      <BreadCrumb title="Sign Up" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Sign Up</h3>
              <form action=""
              onSubmit={formik.handleSubmit}
              className="d-flex flex-column gap-15">


                <CustomInput
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formik.values.firstname}
                  onChange={formik.handleChange("firstname")}
                  onBlur={formik.handleBlur("firstname")}
                />
                <div className="error ">
                  {formik.touched.firstname && formik.errors.firstname}
                </div>


                <CustomInput
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formik.values.lastname}
                  onChange={formik.handleChange("lastname")}
                  onBlur={formik.handleBlur("lastname")}
                />
                <div className="error">
                  {formik.touched.lastname && formik.errors.lastname}
                </div>


                <CustomInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                />
                <div className="error">
                  {formik.touched.email && formik.errors.email}
                </div>


                <CustomInput
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formik.values.mobile}
                  onChange={formik.handleChange("mobile")}
                  onBlur={formik.handleBlur("mobile")}
                />
                <div className="error">
                  {formik.touched.mobile && formik.errors.mobile}
                </div>


                <CustomInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                />
                <div className="error">
                  {formik.touched.password && formik.errors.password}
                </div>


                <div>
                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button className="button border-0">Sign Up</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Signup;
