import { Navigate } from "react-router-dom";

export const PrivateRoute = ({children}) =>{
  const getItemFromLocalStorage = JSON.parse(localStorage.getItem("user"))
  console.log(getItemFromLocalStorage?.token);
  return getItemFromLocalStorage?.token !== undefined ? children : (<Navigate to="/login" replace={true}/> )
}