import React, { useState } from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import CustomInput from "../components/CustomInput";
import { base_url } from '../utils/baseUrl';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../utils/axiosconfig';


const EditCategory = () => {
const [category,setCategory] = useState('');
const {id} = useParams()


// get size
useEffect(
  ()=>{
 
    const fetchCategory= () =>{
      axios.get(`${base_url}category/${id}`)
      .then(
        (response)=>{
          console.log(response.data);
          setCategory(response.data[0].cat_name)
        }
      ).catch(
        (error)=>{
          console.log(error);
        }
      )
    }
    fetchCategory()
  }
  ,[]
)
const updateCategory =async(event)=>{
  event.preventDefault();

  console.log(id,category);
  

  await axios.put(`${base_url}category/`,{id,cat_name: category},config)
  .then(
    (response)=>{
      console.log(response.data);
      if (response.status == 201) {
        alert('Category Updated Successfully');
        window.location.href = '/admin/list-category';
        
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
       Edit Category
      </h3>
      <div>
        <form action="" onSubmit={updateCategory}>
          <CustomInput
            type="text"
            name="title"
            onChng={(e) => setCategory(e.target.value)}
            val={category}
            label="Enter Category"
            id="category"
          />
         
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Edit Category
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default EditCategory