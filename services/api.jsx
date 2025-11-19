import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:8080';

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
    
    const loginResponse = await api.post('/auth/login', { email, password });
    
    if (loginResponse.data.token) {
      await AsyncStorage.setItem('token', loginResponse.data.token);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userName', loginResponse.data.name);
      
      
      const usersResponse = await api.get(`/users?page=0&size=100`);
      const user = usersResponse.data.content.find(u => u.email === email);
      
      if (user) {
        await AsyncStorage.setItem('userId', user.id.toString());
        await AsyncStorage.setItem('userRole', user.userRole);
        
        
        if (user.userRole === 'CANDIDATE') {
          try {
            const candidatesResponse = await api.get(`/candidates?page=0&size=100`);
            const candidate = candidatesResponse.data.content.find(c => c.userId === user.id);
            if (candidate) {
              await AsyncStorage.setItem('candidateId', candidate.id.toString());
            }
          } catch (error) {
            console.log('Candidato ainda não cadastrou perfil completo');
          }
        }
        
        
        if (user.userRole === 'COMPANY') {
          try {
            const companiesResponse = await api.get(`/companies?page=0&size=100`);
            const company = companiesResponse.data.content.find(c => c.userId === user.id);
            if (company) {
              await AsyncStorage.setItem('companyId', company.id.toString());
            }
          } catch (error) {
            console.log('Empresa ainda não cadastrou perfil completo');
          }
        }
      }
    }
    
    return loginResponse.data;
  },

  logout: async () => {
    await AsyncStorage.multiRemove([
      'token', 
      'userId', 
      'userRole', 
      'userEmail', 
      'userName',
      'candidateId', 
      'companyId'
    ]);
  },

  getCurrentUser: async () => {
    const userId = await AsyncStorage.getItem('userId');
    const role = await AsyncStorage.getItem('userRole');
    const email = await AsyncStorage.getItem('userEmail');
    const name = await AsyncStorage.getItem('userName');
    const candidateId = await AsyncStorage.getItem('candidateId');
    const companyId = await AsyncStorage.getItem('companyId');
    return { userId, role, email, name, candidateId, companyId };
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
    const response = await api.get(`/candidacies/candidates/${candidateId}?page=${page}&size=${size}`);
    return response.data;
  },

  listarPorVaga: async (vacancyId, page = 0, size = 10) => {
    const response = await api.get(`/candidacies/vacancy/${vacancyId}?page=${page}&size=${size}`);
    return response.data;
  },

  atualizarStatus: async (id, status) => {
    const response = await api.patch(`/candidacies/${id}/status?status=${status}`);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/candidacies/${id}`);
    return response.data;
  },
};

export default api;