import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokeService } from '@/services/PokeService.js';

describe('PokeService', () => {
  let service;
  let mockAxios;

  // This runs before each test
  beforeEach(() => {
    mockAxios = {
      get: vi.fn(),
    };
    
    service = new PokeService();
    service.axiosInstance = mockAxios;
  });

  // Test data
  const mockResponse = { data: 'test data' };

  // Test 1: Check if getPokeList calls the right URL
  it('getPokeList calls correct URL', async () => {
    mockAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await service.getPokeList(10, 5);

    expect(mockAxios.get).toHaveBeenCalledWith('/pokemon', {
      params: { limit: 10, offset: 5 }
    });
    
    expect(result).toEqual(mockResponse);
  });

  // Test 2: Check if getPokeDetail calls the right URL
  it('getPokeDetail calls correct URL', async () => {
    mockAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await service.getPokeDetail(25);

    expect(mockAxios.get).toHaveBeenCalledWith('/pokemon/25');
    expect(result).toEqual(mockResponse);
  });

  // Test 3: Check if getPokeListByType calls the right URL
  it('getPokeListByType calls correct URL', async () => {
    mockAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await service.getPokeListByType('fire');

    expect(mockAxios.get).toHaveBeenCalledWith('/type/fire');
    expect(result).toEqual(mockResponse);
  });

  // Test 4: Check if getPokeListByAbility calls the right URL
  it('getPokeListByAbility calls correct URL', async () => {
    mockAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await service.getPokeListByAbility('overgrow');

    expect(mockAxios.get).toHaveBeenCalledWith('/ability/overgrow');
    expect(result).toEqual(mockResponse);
  });

  // Test 5: Check if getPokeListByMove calls the right URL
  it('getPokeListByMove calls correct URL', async () => {
    mockAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await service.getPokeListByMove('tackle');

    expect(mockAxios.get).toHaveBeenCalledWith('/move/tackle');
    expect(result).toEqual(mockResponse);
  });

  // Test 6: Check if getPokeListByLocation calls the right URL
  it('getPokeListByLocation calls correct URL', async () => {
    mockAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await service.getPokeListByLocation('kanto');

    expect(mockAxios.get).toHaveBeenCalledWith('/location/kanto');
    expect(result).toEqual(mockResponse);
  });

  // Test 7: Check if getPokeSpecies calls the right URL
  it('getPokeSpecies calls correct URL', async () => {
    mockAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await service.getPokeSpecies(150);

    expect(mockAxios.get).toHaveBeenCalledWith('/pokemon-species/150');
    expect(result).toEqual(mockResponse);
  });

  // Test 8: Check if getEvolutionChain calls the right URL
  it('getEvolutionChain calls correct URL', async () => {
    mockAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await service.getEvolutionChain(2);

    expect(mockAxios.get).toHaveBeenCalledWith('/evolution-chain/2');
    expect(result).toEqual(mockResponse);
  });
});