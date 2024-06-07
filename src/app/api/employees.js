import axios from 'axios';

export const getEmployees = async () => {
    try {
        const response = await axios.get('http://localhost:8080/employees')
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getEmployeeById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data with id ${id}:`, error);
        throw error;
    }
};

export const createEmployee = async (departmentData) => {
    try {
        const response = await axios.post('http://localhost:8080/employees', departmentData);
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

export const updateEmployee = async (id, departmentData) => {
    try {
        const response = await axios.put(`http://localhost:8080/employees/${id}`, departmentData);
        return response.data;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

export const deleteEmployee = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:8080/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};

export const absenMasuk = async (data) => {
    try {
        const response = await axios.post('http://localhost:8080/attendances', data);
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

export const absenKeluar = async (id, data) => {
    try {
        const response = await axios.put(`http://localhost:8080/attendances/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

export const getAttendanceLogs = async (date, departmentId) => {
    try {
        const params = {};
        if (date) params.date = date;
        if (departmentId) params.department_id = departmentId;

        const response = await axios.get('http://localhost:8080/attendance_logs', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};