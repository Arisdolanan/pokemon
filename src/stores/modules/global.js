import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoading: false,
  }),
  getters: {
    isLoading: (state) => state.isLoading,
  },
  actions: {
    setIsLoading(isLoading) {
      this.isLoading = isLoading
    },
  },
})
