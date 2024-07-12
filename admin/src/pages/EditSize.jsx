import React, { useState } from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import CustomInput from "../components/CustomInput";
import { base_url } from '../utils/baseUrl';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../utils/axiosconfig';


const EditSize = () => {
const [size,setSize] = useState('');
const {id} = useParams()


// get size
useEffect(
  ()=>{
 
    const fetchSize = () =>{
      axios.get(`${base_url}size/${id}`)
      .then(
        (response)=>{
          console.log(response.data);
          setSize(response.data[0].size_name)
        }
      ).catch(
        (error)=>{
          console.log(error);
        }
      )
    }
    fetchSize()
  }
  ,[]
)
const updateSize =async(event)=>{
  event.preventDefault();

  console.log(id,size);

  await axios.put(`${base_url}size/`,{id,size},config)
  .then(
    (response)=>{
      console.log(response.data);
      if (response.status == 201) {
        alert('Size Updated Successfully');
        window.location.href = '/admin/list-size';
        
      } else {
        
      }
    }
  ).catch(
    (error)=>{
      console.log(error);
    }
  
  )


}
  
  return (
    <div>
       <div>
      <h3 className="mb-4 title">
       EditSize
      </h3>
      <div>
        <form action="" onSubmit={updateSize}>
          <CustomInput
            type="text"
            name="title"
            onChng={(e) => setSize(e.target.value)}
            val={size}
            label="Enter Size"
            id="size"
          />
         
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Edit Size
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default EditSize