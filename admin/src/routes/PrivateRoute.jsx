import { Navigate } from "react-router-dom";
import MainLayout from "../components/CashierMainLayout";

// // export const PrivateRoute = ({children}) =>{
// //   const getItemFromLocalStorage = JSON.parse(localStorage.getItem("user"))
// //   console.log(getItemFromLocalStorage?.token);
// //   return (getItemFromLocalStorage?.token !== undefined) ? children : (<Navigate to="/" replace={true}/> )
// // }

export const PrivateRoute = () => {

  const getItemFromLocalStorage = JSON.parse(localStorage.getItem("user"))
  console.log(getItemFromLocalStorage?.isAdmin)
  if(getItemFromLocalStorage?.isAdmin === "admin"){
    return <MainLayout />
  };
  if(getItemFromLocalStorage?.isAdmin === "cashier"){
    return <Navigate to="/cashier" replace={true} />
  }else{
    return <Navigate to="/" replace={true} />
  }

};