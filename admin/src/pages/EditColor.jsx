import React, { useState, useEffect } from 'react';
import CustomInput from "../components/CustomInput";
import axios from 'axios';
import { useParams,useLocation } from 'react-router-dom';
import { base_url } from '../utils/baseUrl';
import { config } from '../utils/axiosconfig';

const EditColor = () => {
  const [colorName, setColorName] = useState('');
  const [colorValue, setColorValue] = useState('');
  // const {id} = useParams();
  const location = useLocation();
  const id = location.hash.substring(1); // This will be 'ffffff'console.log(id);

  console.log(id);

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const response = await axios.get(`${base_url}color/${id}`);
        console.log(response);
        setColorName(response.data[0].col_name);
        setColorValue(response.data[0].col_code);
      } catch (error) {
        console.log(error);
      }
    };
    fetchColor();
  }, []);

  const updateColor = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(`${base_url}color/`, { id, col_name: colorName, col_code: colorValue }, config);
      if (response.status == 201) {
        alert('Color Updated Successfully');
        window.location.href = '/admin/list-color';
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h3 className="mb-4 title">Edit Color</h3>
        <div>
          <form action="" onSubmit={updateColor}>
            <CustomInput
              type="text"
              name="title"
              onChng={(e) => setColorName(e.target.value)}
              val={colorName}
              label="Enter Color Name"
              id="color"
            />
            <CustomInput
              type="color"
              name="color"
              onChng={(e) => setColorValue(e.target.value)}
              val={colorValue}
              label="Enter Color Value"
              id="color"
            />
            <button
              className="btn btn-success border-0 rounded-3 my-5"
              type="submit"
            >
              Edit Color
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditColor;
