import { API_CONFIG } from '@/configs/api.js';
import axios from 'axios';

export class PokeService {
  constructor() {
    this.baseUrl = API_CONFIG.POKE_API_BASE_URL;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    });
  }

  async getPokeList(limit = 151, offset = 0) {
    const response = await this.axiosInstance.get(`/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  }

  async getPokeDetail(id) {
    const response = await this.axiosInstance.get(`/pokemon/${id}`);
    return response.data;
  }

  async getPokeListByType(type) {
    const response = await this.axiosInstance.get(`/type/${type}`);
    return response.data;
  }

  async getPokeListByAbility(ability) {
    const response = await this.axiosInstance.get(`/ability/${ability}`);
    return response.data;
  }

  async getPokeListByMove(move) {
    const response = await this.axiosInstance.get(`/move/${move}`);
    return response.data;
  }

  async getPokeListByLocation(location) {
    const response = await this.axiosInstance.get(`/location/${location}`);
    return response.data;
  }

  async getPokeSpecies(id) {
    const response = await this.axiosInstance.get(`/pokemon-species/${id}`);
    return response.data;
  }

  async getEvolutionChain(id) {
    const response = await this.axiosInstance.get(`/evolution-chain/${id}`);
    return response.data;
  }
}