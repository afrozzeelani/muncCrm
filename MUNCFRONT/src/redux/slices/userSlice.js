import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
const initialState = {
    userData:null,
    error: null,
    notification: [],
    messageData: {taskId: null, to: null}
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
         // Your existing reducers here
    
    },
    extraReducers: (builder)=>{
        builder.addCase(userInfo.fulfilled, (state, action) => { // Handle userInfo action
           const {Account,Email, FirstName, LastName,_id} = action.payload;
           state.userData = {Account,Email, FirstName, LastName,_id}
            state.notification = action.payload.Notification;
        })
        .addCase(userInfo.rejected, (state, action) => {
            state.error = action.payload;
        }) .addCase(notificationAdd.fulfilled, (state, action) => {
           
            state.notification = action.payload;
        })
        .addCase(notificationStatusUpdate.fulfilled, (state, action) => {
            state.notification = action.payload.notifications;
            state.messageData = action.payload.messageData; 
        })
        .addCase(notificationStatusUpdate.rejected, (state, action) => {
         
            state.error = action.payload;
        }) .addCase(notificationDelete.fulfilled, (state, action) => {
            state.notification = action.payload.notifications;
            
        })
        .addCase(notificationDelete.rejected, (state, action) => {
         
            state.error = action.payload;
        });
        }
    
});

export const userInfo = createAsyncThunk(
    "user/userInfo",
    async ({_id}, thunkAPI) => {
        try {
  
            const response = await axios.get(`${BASE_URL}/api/userData/${_id}`,{
                headers: {
                  authorization: localStorage.getItem("token") || ""
                }});   
                   
            return response.data;
        } catch (error) {
           
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch user info");
        }
    }
);
export const notificationAdd = createAsyncThunk(
    "user/notificationAdd",
    (noti, thunkAPI) => {
       
        const currentNotifications = thunkAPI.getState().user.notification;
        const updatedNotifications = [noti, ...currentNotifications];
        return updatedNotifications;
    }
);
export const notificationStatusUpdate = createAsyncThunk(
    "user/NotificationStatusUpdate",
    async ({id, val}, thunkAPI) => {
        console.log(thunkAPI.getState().user)
        try {
            const response = await axios.post(`${BASE_URL}/api/notificationStatusUpdate/${id}`, { email:thunkAPI.getState().user.userData.Email },{
                headers: {
                  authorization: localStorage.getItem("token") || ""
                }});   
                const updatedNotifications = thunkAPI.getState().user.notification.map((notification) => {
                    if (notification.taskId === id) {
                        return { ...notification, status: "seen" };
                    }
                    return notification;
                });

                const messageData = {taskId:val.taskIden, to:val.to};
    
                return { notifications: updatedNotifications, messageData };
        } catch (error) {
           
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to change status");
        }
    }
);
export const notificationDelete = createAsyncThunk(
    "user/notificationDelete",
    async (id, thunkAPI) => {
        try {
            console.log(thunkAPI.getState())
            
            const response = await axios.post(`${BASE_URL}/api/notificationDeleteHandler/${id}`, { email:thunkAPI.getState().user.userData.Email },{
                headers: {
                  authorization: localStorage.getItem("token") || ""
                }});   
                const updatedNotifications = thunkAPI.getState().user.notification.filter((notification) => {
                   return notification.taskId !==id
                });

             
                console.log(updatedNotifications)
                return { notifications: updatedNotifications };
        } catch (error) {
            console.log(error)
           
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to change status");
        }
    }
);

export default userSlice.reducer;
