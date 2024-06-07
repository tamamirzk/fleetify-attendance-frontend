import axios from 'axios';

export const getDepartments = async () => {
    try {
        const response = await axios.get('http://localhost:8080/departments')
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getDepartmentById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/departments/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data with id ${id}:`, error);
        throw error;
    }
};

export const createDepartment = async (departmentData) => {
    try {
        const response = await axios.post('http://localhost:8080/departments', departmentData);
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

export const updateDepartment = async (id, departmentData) => {
    try {
        const response = await axios.put(`http://localhost:8080/departments/${id}`, departmentData);
        return response.data;
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
};

export const deleteDepartment = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:8080/departments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
};