import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BASE_URL from "../../Pages/config/config";
import axios from "axios";
import jwt from "jsonwebtoken";
import {userInfo} from "./userSlice"

const initialState = {
    loginInfo: null,
    loginError: "",

    attednaceInfo: null,
    attednaceError: ""
};

export const 
loginUser = createAsyncThunk(
    "login/loginUser",
    async (bodyLogin, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/login`, bodyLogin);
            localStorage.setItem("token", response.data);
          
            const data = jwt.decode(response.data);
           
            thunkAPI.dispatch(attendanceInfo({employeeId: data._id,attendanceId:data.attendanceObjID, status:"login"}))
            thunkAPI.dispatch(userInfo(data))
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
        }
    }
);



export const attendanceInfo = createAsyncThunk(
    "login/attendanceInfo",
    async ({employeeId,attendanceId,status}, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/attendance/${attendanceId}`,{employeeId,status},{
                headers: {
                    authorization: localStorage.getItem("token") || ""
                  }
            });
           
            return response.data.message;
        } catch (error) {
           
            return thunkAPI.rejectWithValue(error.response?.data?.error || "Failed to mark user attendance");
        }
    }
);

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {// Handle loginUser action
                state.loginError = ""; // Clear previous errors
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const decodedData = action.payload;
                state.loginInfo = decodedData;
                state.loginError = "";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginError = action.payload;
            })
         
            .addCase(attendanceInfo.fulfilled, (state, action) => { // Handle attendance action
                state.attednaceInfo = action.payload;
            })
            .addCase(attendanceInfo.rejected, (state, action) => {
                state.attednaceError = action.payload;
            });
    },
});

export default loginSlice.reducer;
