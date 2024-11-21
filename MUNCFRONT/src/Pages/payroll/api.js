import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payroll'; // Adjust to your backend URL

// Function to generate payroll
export const generatePayroll = async (month, year) => {
  try {
    const response = await axios.get(`${API_URL}/generatePayroll`, {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating payroll:", error);
    throw error;
  }
};

// Function to fetch payroll records for a specific employee
export const getEmployeePayroll = async (employeeId, month, year) => {
  try {
    const response = await axios.get(`${API_URL}/employeePayroll`, {
      params: { employeeId, month, year },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payroll:", error);
    throw error;
  }
};
