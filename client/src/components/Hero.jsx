import React from 'react';
import heroImg from '../assets/shop123.jpeg'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div style={{height: '90vh', backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center'}} className="position-relative w-100">
      <div style={{top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,.6)'}} className="position-absolute text-white d-flex flex-column align-items-center justify-content-center">
        <div className="container">
          <div className="d-flex flex-column align-items-center">
            <span style={{color: '#a5a5a5'}} className="text-uppercase">Latest Fashions</span>
            <h1 style={{color: '#ffffff'}} className="mb-4 mt-2 display-4 font-weight-bold">Discover Your Unique Style with Our</h1>
            <p style={{color: '#e2e2e2'}}className='text-center'>Explore our wide range of clothing and accessories from top brands. Whether you're looking for casual wear, formal attire, or the latest trends, we have something for every occasion.</p>
            <div className="mt-5">
              <Link to={"/product"} style={{borderRadius: '30px', backgroundColor: '#ffffff52', color:"white"}} className="btn px-5 py-3 mt-3 mt-sm-0">Shop Now</Link>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Hero;
