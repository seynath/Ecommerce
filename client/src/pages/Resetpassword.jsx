import React, { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link, useLocation, useParams } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { base_url } from "../utils/axiosConfig";
import axios from "axios";

const Resetpassword = () => {
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');

  const { token } = useParams();
  console.log(token);

  const handleResetPassword = (e) => {
    e.preventDefault();
    console.log(password);
    console.log(confpassword);
    if (password == confpassword){
      axios.put(`${base_url}user/reset-password/${token}`, {password})
      .then(
        (response) => {
          console.log(response)
          alert("Password Reset Successful");
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  return (
    <>
      <Meta title={"Reset Password"} />
      <BreadCrumb title="Reset Password" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Reset Password</h3>
              <form action="" onSubmit={handleResetPassword} className="d-flex flex-column gap-15">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  name="confpassword"
                  placeholder="Confirm Password"
                  minLength={8}
                  required
                  value={confpassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                />
                <div>
                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button className="button border-0">Submit</button>
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

export default Resetpassword;
