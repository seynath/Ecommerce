import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FaCcStripe } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsExclamationCircle } from "react-icons/bs";


const SuccessPayment = () => {
  return (
    <div className="container mt-5 mb-5 d-flex justify-content-center ">
      <div className="row d-flex justify-content-center align-items-center shadow" style={{minHeight:"600px"}}>
        <div className="col-md-6 text-center">
          <div className="success-icon" style={{color:"red"}}>
            {/* <FontAwesomeIcon icon={faCheckCircle} size="3x" color="green" /> */}
            <FaCcStripe  size={170} />
          </div>
          <h2 className="success-message" style={{ color: '#000000' }}>Payment Unuccessful!<span style={{color:"red"}}><BsExclamationCircle /></span></h2>
          <p className="success-description">
          Your payment could not be processed at this time. Please check your payment details and try again.          </p>
          <button className="btn btn-success mt-3 mb-5" style={{ backgroundColor: '#000000', borderRadius:"20px" }}>
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;