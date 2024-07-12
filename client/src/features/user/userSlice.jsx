import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { authService } from './userService';
import { toast } from 'react-toastify';
import { getCart } from '../products/productSlice';

const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const registerUser = createAsyncThunk(
  'auth/register', async(userData ,thunkAPI) => {
    try{
      

     return await authService.register(userData);

    }catch(error){
      return thunkAPI.rejectWithValue(error.response.data);

    }
  }
);

export const createOrder = createAsyncThunk(
  'auth/createOrder', async(orderData ,thunkAPI) => {
    try{
      return await authService.createOrder(orderData);
    }catch(error){
      return thunkAPI.rejectWithValue(error.response.data);
    }
});





// export const loginUser = createAsyncThunk(
//   'auth/login', async(userData ,thunkAPI) => {
//     try{
//       return await authService.login(userData);
      
//     }catch(error){
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
// });



export const loginUser = createAsyncThunk(
  'auth/login', 
  async (values , {dispatch, rejectWithValue}) => {
    try{
      const response = await authService.login(values);
      if (response) {
        dispatch(getCart());
      }
      return response;
    } catch(error){
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: getUserfromLocalStorage,
  isError  : false,
  isSuccess : false,
  isLoading: false,
  message : ""
};

export const authSlice  = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(registerUser.pending, (state) => {
      state.isLoading = true})
    .addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess= true;
      state.createUser = action.payload;
      // if(state.isSuccess === true){
      //   toast.info("Registration Successful");
      // }
      // state.user = action.payload;
    })
    .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess= false;
        state.message = action.payload;
        if(state.isError === true){
          console.log(state.auth);
          toast.error("Server Error, Please try again later");
        }
      })


      .addCase(loginUser.pending, (state) => {
        state.isLoading = true})
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess= true;
        state.user = action.payload;
       
        // state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess= false;
          state.message = action.payload;
          // if(state.isError === true){
          //   toast.error("Server Error, Please try again later");
          // }
        })
      
        .addCase(createOrder.pending, (state) => {
          state.isLoading = true})
        .addCase(createOrder.fulfilled, (state,action) =>{
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = action.payload.message; // extract only the message property

          toast.info("Order Created Successfully");
        })
        .addCase(createOrder.rejected, (state)=>{
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          toast.error("Error creating order, Please try again later");
        
        })
    

    
}});

export default authSlice.reducer;