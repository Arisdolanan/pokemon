import { defineStore } from 'pinia';
import { PokeService } from '@/services/PokeService.js';

export const usePokeStore = defineStore('poke', {
  state: () => ({
    pokeList: [],
    pokeDetails: {},
    evolutionChains: {},
    loading: false,
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
  }),

  getters: {
    filteredPokeList: (state) => {
      if (!state.searchQuery) return state.pokeList;
      return state.pokeList.filter((pokemon) => pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase()));
    },

    paginatedPokeList: (state) => {
      const filteredList = state.searchQuery
        ? state.pokeList.filter((pokemon) => pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
        : state.pokeList;
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return filteredList.slice(start, end);
    },

    totalPages: (state) => {
      const filteredList = state.searchQuery
        ? state.pokeList.filter((pokemon) => pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
        : state.pokeList;
      return Math.ceil(filteredList.length / state.itemsPerPage);
    },
  },

  actions: {
    async fetchPokeList() {
      this.loading = true;
      try {
        const pokeService = new PokeService();
        const response = await pokeService.getPokeList(151, 0);

        const detailedPokemon = [];
        for (const pokemon of response.results) {
          try {
            const id = pokemon.url.split('/').slice(-2)[0];
            const detail = await pokeService.getPokeDetail(id);
            detailedPokemon.push({
              ...pokemon,
              id: detail.id,
              types: detail.types,
              stats: detail.stats,
              abilities: detail.abilities,
              height: detail.height,
              weight: detail.weight,
              base_experience: detail.base_experience,
            });
          } catch (error) {
            console.error(`Error fetching details for ${pokemon.name}:`, error);
            detailedPokemon.push(pokemon);
          }
        }

        this.pokeList = detailedPokemon;
        this.totalItems = response.count;
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchPokeDetail(id) {
      this.loading = true;
      try {
        const pokeService = new PokeService();
        const pokemon = await pokeService.getPokeDetail(id);
        this.pokeDetails[id] = pokemon;

        this.fetchEvolutionChain(id).catch((error) => {
          console.error('Error fetching evolution chain:', error);
        });

        return pokemon;
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchEvolutionChain(id) {
      try {
        const pokeService = new PokeService();
        const species = await pokeService.getPokeSpecies(id);

        if (species.evolution_chain?.url) {
          const evolutionChainId = species.evolution_chain.url.split('/').slice(-2)[0];
          const evolutionChain = await pokeService.getEvolutionChain(evolutionChainId);
          const evolutionDetails = await this.parseAndFetchEvolutionDetails(evolutionChain.chain, pokeService);

          this.$patch((state) => {
            state.evolutionChains[id] = {
              ...evolutionChain,
              evolutionDetails,
            };
          });
        } else {
          this.$patch((state) => {
            state.evolutionChains[id] = {
              evolutionDetails: [],
            };
          });
        }
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
        this.$patch((state) => {
          state.evolutionChains[id] = {
            evolutionDetails: [],
            error: error.message,
          };
        });
      }
    },

    async parseAndFetchEvolutionDetails(chain, pokeService) {
      const evolutions = [];

      const extractId = (url) => {
        return url.split('/').slice(-2)[0];
      };
      const fetchPokemonDetails = async (speciesUrl) => {
        const id = extractId(speciesUrl);
        try {
          const pokemon = await pokeService.getPokeDetail(id);
          return {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types,
          };
        } catch (error) {
          console.error(`Error fetching details for Pokemon ${id}:`, error);
          return {
            id: extractId(speciesUrl),
            name: speciesUrl.split('/').slice(-2)[0],
            types: [],
          };
        }
      };

      try {
        if (chain.species && chain.species.url) {
          evolutions.push(await fetchPokemonDetails(chain.species.url));
        }

        if (chain.evolves_to && chain.evolves_to.length > 0) {
          for (const evolution of chain.evolves_to) {
            if (evolution.species && evolution.species.url) {
              evolutions.push(await fetchPokemonDetails(evolution.species.url));

              if (evolution.evolves_to && evolution.evolves_to.length > 0) {
                for (const secondEvolution of evolution.evolves_to) {
                  if (secondEvolution.species && secondEvolution.species.url) {
                    evolutions.push(await fetchPokemonDetails(secondEvolution.species.url));
                  }
                }
              }
            }
          }
        }

        return evolutions;
      } catch (error) {
        console.error('Error parsing evolution chain:', error);
        return [];
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query;
      this.currentPage = 1;
    },

    setCurrentPage(page) {
      this.currentPage = page;
    },

    setItemsPerPage(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
      this.currentPage = 1;
    },

    updatePokeInfo(id, updatedInfo) {
      if (this.pokeDetails[id]) {
        this.pokeDetails[id] = { ...this.pokeDetails[id], ...updatedInfo };
      }
    },
  },

  persist: true,
});
