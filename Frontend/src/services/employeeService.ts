import axios from "axios";

const api = axios.create({
    baseURL: "/api",        // Usando o proxy do Vite
    timeout: 10000,
});

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    department?: string;
    position?: string;
    salary: number;
    hireDate: string;
}

export interface SortConfig {
    key: keyof Employee;
    direction: 'asc' | 'desc';
}

export const employeeService = {
    getAll: async (page: number = 0, size: number = 10, search: string = '') => {
        const response = await api.get('/employees', {
            params: { page, size, search }
        });
        return response.data;
    },

    getById: (id: number) => api.get(`/employees/${id}`),

    create: (data: Omit<Employee, 'id' | 'fullName'>) =>
        api.post('/employees', data),

    update: (id: number, data: Partial<Employee>) => 
        api.put(`/employees/${id}`, data),

    delete: (id: number) => api.delete(`/employees/${id}`),
};