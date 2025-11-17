import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao buscar token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro da API:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta da API');
    } else {
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);


export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    // Salvar token
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userId', response.data.userId.toString());
      await AsyncStorage.setItem('userRole', response.data.role);
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'userId', 'userRole']);
  },

  getCurrentUser: async () => {
    const userId = await AsyncStorage.getItem('userId');
    const role = await AsyncStorage.getItem('userRole');
    return { userId, role };
  },
};


export const userService = {
  criar: async (dados) => {
    const response = await api.post('/users', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10) => {
    const response = await api.get(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/users/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};


export const candidateService = {
  criar: async (dados) => {
    const response = await api.post('/candidates', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10, filters = {}) => {
    let url = `/candidates?page=${page}&size=${size}`;
    if (filters.disabilityType) url += `&disabilityType=${filters.disabilityType}`;
    if (filters.skills) url += `&skills=${filters.skills}`;
    const response = await api.get(url);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/candidates/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
};


export const companyService = {
  criar: async (dados) => {
    const response = await api.post('/companies', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10, filters = {}) => {
    let url = `/companies?page=${page}&size=${size}`;
    if (filters.name) url += `&name=${filters.name}`;
    if (filters.sector) url += `&sector=${filters.sector}`;
    const response = await api.get(url);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/companies/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },
};


export const vacancyService = {
  criar: async (dados) => {
    const response = await api.post('/vacancies', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10, filters = {}) => {
    let url = `/vacancies?page=${page}&size=${size}`;
    if (filters.title) url += `&title=${filters.title}`;
    if (filters.city) url += `&city=${filters.city}`;
    if (filters.vacancyType) url += `&vacancyType=${filters.vacancyType}`;
    const response = await api.get(url);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/vacancies/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/vacancies/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/vacancies/${id}`);
    return response.data;
  },
};


export const candidacyService = {
 
  criar: async (dados) => {
    const response = await api.post('/candidacies', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10) => {
    const response = await api.get(`/candidacies?page=${page}&size=${size}`);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/candidacies/${id}`);
    return response.data;
  },

  listarPorCandidato: async (candidateId, page = 0, size = 10) => {
    const response = await api.get(`/candidacies/candidate/${candidateId}?page=${page}&size=${size}`);
    return response.data;
  },

 
  listarPorVaga: async (vacancyId, page = 0, size = 10) => {
    const response = await api.get(`/candidacies/vacancy/${vacancyId}?page=${page}&size=${size}`);
    return response.data;
  },

 
  atualizarStatus: async (id, status) => {
    const response = await api.patch(`/candidacies/${id}/status`, { status });
    return response.data;
  },


  deletar: async (id) => {
    const response = await api.delete(`/candidacies/${id}`);
    return response.data;
  },
};

export default api;