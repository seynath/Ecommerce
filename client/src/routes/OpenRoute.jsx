import { Navigate } from "react-router-dom";

export const OpenRoute = ({children}) =>{
  const getItemFromLocalStorage = JSON.parse(localStorage.getItem("user"))
  console.log(getItemFromLocalStorage?.token);
  return getItemFromLocalStorage?.token === undefined ? children : (<Navigate to="/" replace={true}/> )
}