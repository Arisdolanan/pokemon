<template>
  <div class="pokemon-home">
    <!-- Header -->
    <div class="container-fluid header-bg text-white py-3 py-md-2 mb-3 mb-md-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-md-4 mb-3 mb-md-0">
            <h1 class="display-6 display-md-5 mb-0">Pokémon</h1>
          </div>
          <div class="col-12 col-md-5 mb-3 mb-md-0">
            <!-- Search Bar with Filter Button -->
            <div class="search-container">
              <div class="input-group input-group-lg">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control border-start-0"
                  placeholder="Search Pokémon by name..."
                  v-model="searchQuery"
                  @input="handleSearch"
                />
                <button class="btn btn-outline-secondary" type="button" @click="clearSearch" v-if="searchQuery">
                  <i class="bi bi-x-lg"></i>
                </button>
                <!-- Advanced Filter Icon Button -->
                <button class="btn filter-icon-btn" type="button" @click.stop="showFilterModal = true">
                  <i class="bi bi-funnel"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-3 text-center text-md-end">
            <div class="pokemon-count">
              <span class="badge bg-light text-white fs-7">{{ totalItems }} Pokémon</span>
              <span
                v-if="selectedRegions.length > 0 || selectedTypes.length > 0"
                class="badge active-filter-badge ms-2"
                @click.stop="showFilterModal = true"
                role="button"
              >
                <i class="bi bi-funnel-fill me-1"></i>
                {{ selectedRegions.length + selectedTypes.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Filter Modal -->
      <div class="modal-backdrop fade show" v-show="showFilterModal"></div>
      <div class="modal" tabindex="-1" :class="{ 'd-block': showFilterModal, show: showFilterModal }" v-show="showFilterModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="filterModalLabel">Advanced Filter</h5>
              <button type="button" class="btn-close" @click.stop="showFilterModal = false" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="filter-section p-3 rounded bg-light mb-3 border">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="fw-bold mb-0">Filter by Region</label>
                  <span class="badge filter-badge" v-if="selectedRegions.length > 0">{{ selectedRegions.length }} selected</span>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <div v-for="region in regions" :key="region.value" class="form-check form-check-inline filter-check">
                    <input class="form-check-input" type="checkbox" :id="'region-' + region.value" :value="region.value" v-model="selectedRegions" />
                    <label class="form-check-label" :for="'region-' + region.value">{{ region.label }}</label>
                  </div>
                </div>
              </div>
              <div class="filter-section p-3 rounded bg-light border">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="fw-bold mb-0">Filter by Type</label>
                  <span class="badge filter-badge" v-if="selectedTypes.length > 0">{{ selectedTypes.length }} selected</span>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <div v-for="type in types" :key="type" class="form-check form-check-inline filter-check">
                    <input class="form-check-input" type="checkbox" :id="'type-' + type" :value="type" v-model="selectedTypes" />
                    <label class="form-check-label" :for="'type-' + type">{{ type }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" @click.stop="resetFilters">Reset Filters</button>
              <div>
                <button type="button" class="btn btn-secondary me-2" @click.stop="showFilterModal = false">Close</button>
                <button type="button" class="btn filter-apply-btn" @click.stop="applyFilters">Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loading State -->
      <LoadingSpinner v-if="loading" height="400px" />

      <!-- Pokémon Grid -->
      <div v-else>
        <!-- Results Info -->
        <div class="row mb-3">
          <div class="col-12">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <p class="text-muted mb-2 mb-md-0">
                Showing {{ filteredPokeList.length }} of {{ totalItems }} Pokémon
                <span v-if="searchQuery" class="text-primary">for "{{ searchQuery }}"</span>
              </p>
              <div class="d-flex align-items-center">
                <label class="form-label me-2 mb-0">Items per page:</label>
                <select class="form-select form-select-sm" style="width: auto" v-model="storeItemsPerPage">
                  <option value="12">12</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Pokémon Cards -->
        <div class="row g-3 g-md-4 mb-4">
          <div v-for="pokemon in paginatedPokeList" :key="pokemon.name" class="col-6 col-sm-4 col-md-3 col-lg-2">
            <PokemonCard :pokemon="pokemon" />
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredPokeList.length === 0 && !loading" class="text-center py-5">
          <div class="no-results">
            <i class="bi bi-search display-1 text-muted mb-3"></i>
            <h3 class="text-muted">No Pokémon found</h3>
            <p class="text-muted">Try adjusting your search terms</p>
            <button class="btn btn-primary" @click="clearSearch">Clear Search</button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="row">
          <div class="col-12">
            <nav aria-label="Pokémon pagination">
              <ul class="pagination pagination-sm pagination-md justify-content-center flex-wrap">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>

                <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                  <button class="page-link" @click="changePage(page)">
                    {{ page }}
                  </button>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokeStore } from '@/stores';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import PokemonCard from '@/components/PokemonCard.vue';
import { REGION_LIST, TYPE_LIST } from '@/constants';

export default {
  name: 'Home',
  components: {
    LoadingSpinner,
    PokemonCard,
  },
  setup() {
    const pokeStore = usePokeStore();
    return {
      pokeStore,
    };
  },
  data() {
    return {
      searchQuery: '',
      selectedRegions: [],
      selectedTypes: [],
      regions: REGION_LIST,
      types: TYPE_LIST,
      showFilterModal: false,
    };
  },
  computed: {
    loading() {
      return this.pokeStore.loading;
    },
    pokeList() {
      return this.pokeStore.pokeList;
    },
    filteredPokeList() {
      let list = this.pokeStore.pokeList;
      if (this.selectedRegions.length > 0) {
        list = list.filter((pokemon) => this.selectedRegions.includes(pokemon.region));
      }
      if (this.selectedTypes.length > 0) {
        list = list.filter((pokemon) =>
          pokemon.types.some((t) => this.selectedTypes.includes(t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)))
        );
      }
      if (this.searchQuery) {
        list = list.filter((pokemon) => pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }
      return list;
    },
    paginatedPokeList() {
      const start = (this.pokeStore.currentPage - 1) * this.pokeStore.itemsPerPage;
      const end = start + this.pokeStore.itemsPerPage;
      return this.filteredPokeList.slice(start, end);
    },
    currentPage() {
      return this.pokeStore.currentPage;
    },
    totalPages() {
      return Math.ceil(this.filteredPokeList.length / this.pokeStore.itemsPerPage);
    },
    totalItems() {
      return this.filteredPokeList.length;
    },
    storeItemsPerPage: {
      get() {
        return this.pokeStore.itemsPerPage;
      },
      set(value) {
        this.pokeStore.setItemsPerPage(value);
      },
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
      this.pokeStore.setSearchQuery('');
      this.pokeStore.setCurrentPage(1);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.pokeStore.setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    applyFilters() {
      this.showFilterModal = false;
      this.pokeStore.setCurrentPage(1);
      this.$forceUpdate();
    },
    resetFilters() {
      this.selectedRegions = [];
      this.selectedTypes = [];
      this.pokeStore.setCurrentPage(1);
      this.$forceUpdate();
    },
    handleKeyDown(event) {
      if (event.key === 'Escape' && this.showFilterModal) {
        this.showFilterModal = false;
      }
    },
    handleOutsideClick(event) {
      if (this.showFilterModal) {
        const modalContent = document.querySelector('.modal-content');
        if (
          modalContent &&
          !modalContent.contains(event.target) &&
          !event.target.closest('.filter-icon-btn') &&
          !event.target.closest('.active-filter-badge')
        ) {
          this.showFilterModal = false;
        }
      }
    },
  },
  async mounted() {
    await this.pokeStore.fetchPokeList();
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('click', this.handleOutsideClick, true);
    this.showFilterModal = false;
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleOutsideClick, true);
  },
};
</script>

<style scoped>
.pokemon-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Modal Styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}

.modal.show {
  display: block;
  transition: opacity 0.15s linear;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  pointer-events: none;
  max-width: 800px;
  z-index: 1050;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
}

.btn-close {
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  padding: 0.25em 0.25em;
  color: #000;
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;
  cursor: pointer;
}

/* Filter Styling */
.filter-check {
  background-color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease;
}

.filter-check:hover {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.filter-check .form-check-input:checked + .form-check-label {
  font-weight: 600;
  color: #d63031;
}

.filter-badge {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(214, 48, 49, 0.9)) !important;
  color: white;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
}

.filter-apply-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #d63031 100%);
  color: white;
  border: none;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(214, 48, 49, 0.3);
}

.filter-apply-btn:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e84118 50%, #c23616 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(214, 48, 49, 0.4);
}

.header-bg {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #d63031 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(214, 48, 49, 0.2);
}

.header-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="pokeball" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/><line x1="2" y1="10" x2="18" y2="10" stroke="rgba(255,255,255,0.1)" stroke-width="1"/><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23pokeball)"/></svg>');
  opacity: 0.3;
}

.header-bg .container {
  position: relative;
  z-index: 1;
}

.header-bg h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

.header-bg .lead {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 500;
}

.pokemon-count .badge.bg-light {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.active-filter-badge {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(214, 48, 49, 0.9)) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(214, 48, 49, 0.3);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(214, 48, 49, 0.2);
  color: white;
}

.active-filter-badge:hover {
  background: linear-gradient(135deg, rgba(255, 82, 82, 0.95), rgba(194, 54, 22, 0.95)) !important;
  transform: translateY(-1px);
  box-shadow: 0 3px 7px rgba(214, 48, 49, 0.3);
}

.search-container {
  margin: 0 auto;
}

.search-container .input-group {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  overflow: hidden;
}

.search-container .form-control {
  border: none;
  font-size: 1rem;
}

.search-container .form-control:focus {
  box-shadow: none;
  border-color: transparent;
}

.search-container .input-group-text {
  border: none;
}

.filter-icon-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0.5rem 1rem;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #d63031 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(214, 48, 49, 0.3);
}

.filter-icon-btn:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e84118 50%, #c23616 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(214, 48, 49, 0.4);
}

.no-results {
  background: white;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.pagination .page-link {
  border: none;
  color: #6c757d;
  padding: 0.75rem 1rem;
  margin: 0 2px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  color: #495057;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #adb5bd;
  background-color: transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-bg {
    padding: 1rem 0;
  }

  .header-bg h1 {
    font-size: 1.75rem;
    text-align: center;
  }

  .search-container {
    max-width: 100%;
  }

  .search-container .form-control {
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }

  .search-container .input-group-text {
    padding: 0.75rem 1rem;
  }

  .filter-icon-btn {
    padding: 0.75rem 0.75rem;
  }

  .pokemon-count {
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .pokemon-count .badge {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 576px) {
  .header-bg {
    padding: 0.75rem 0;
  }

  .header-bg h1 {
    font-size: 1.5rem;
  }

  .search-container .input-group {
    border-radius: 25px;
  }

  .search-container .form-control {
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
  }

  .search-container .input-group-text {
    padding: 0.5rem 0.75rem;
  }

  .filter-icon-btn {
    padding: 0.5rem 0.75rem;
  }

  .pagination .page-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    margin: 0 1px;
  }

  .pokemon-count .badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .pokemon-count {
    margin-top: 0.5rem;
    gap: 0.3rem;
  }

  /* Modal adjustments for mobile */
  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
  }

  .modal-body {
    padding: 0.75rem;
  }

  .filter-check {
    padding: 0.4rem 0.6rem;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
    font-size: 0.9rem;
  }
}

/* Custom pagination sizes */
.pagination-sm .page-link {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.pagination-md .page-link {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .pagination-md .page-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
