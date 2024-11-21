import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import departmentReducer from "./slices/departmentSlice";
import attendanceReducer from './slices/attendanceSlice';
import holidaysReducer from './slices/holidaysSlice';
import employeeReducer from './slices/employeeSlice'; 
import personalInfoReducer from './slices/personalInfoSlice';
import tasksReducer from './slices/tasksSlice';
import loginReducer from './slices/loginSlice';
import userReducer from './slices/userSlice';
import chatReducer from './slices/messageSlice';
import { createTransform } from "redux-persist";

// Transform to only persist userData
const userTransform = createTransform(
    (inboundState) => ({ userData: inboundState.userData }), // Transform inbound state
    (outboundState) => outboundState, // No transformation on outbound state
    { whitelist: ["user", ] } // Apply transform only for the user reducer
);

const rootPersistConfig = {
    key: "root",
    storage,
    keyPrefix: "redux-",
    whitelist: ['user', "chat"], // Only persist the user reducer
    transforms: [userTransform] // Apply the transform
};

const rootReducer = combineReducers({
    department: departmentReducer,
    attendance: attendanceReducer,
    holidays: holidaysReducer,
    employee: employeeReducer,
    personalInfo: personalInfoReducer,
    tasks: tasksReducer,
    login: loginReducer,
    user: userReducer,
    chat: chatReducer
});

export { rootPersistConfig, rootReducer };