import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_URL from '../../Pages/config/config';

export const fetchAttendanceData = createAsyncThunk(
  'attendance/fetchAttendanceData',
  async () => {
    const response = await axios.get(`${BASE_URL}/api/todays-attendance`,
      {
       headers: {
                authorization: localStorage.getItem("token") || "",
              },
    }
  );
    return response.data;
  }
);

const attendanceSlice = createSlice({
  name: 'Todaysattendance',
  initialState: {
    attendanceData: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceData = action.payload;
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default attendanceSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import BASE_URL from '../../Pages/config/config';

// // Pass userData as an argument when dispatching this thunk
// export const fetchAttendanceData = createAsyncThunk(
//   'attendance/fetchAttendanceData',
//   async (userData) => {
//     const usertype = userData?.Account;
//     const response = await axios.get(`${BASE_URL}/api/todays-attendance`, {
//       headers: {
//         authorization: localStorage.getItem('token') || '',
//       },
//     });
    
//     // Log the response for debugging
//     console.log(response.data);
    
//     // Return filtered data based on user type
//     return usertype === 1 
//       ? response.data 
//       : response.data.filter(data => data.Account !== 1);
//   }
// );

// const attendanceSlice = createSlice({
//   name: 'Todaysattendance',
//   initialState: {
//     attendanceData: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAttendanceData.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchAttendanceData.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.attendanceData = action.payload;
//       })
//       .addCase(fetchAttendanceData.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// export default attendanceSlice.reducer;
