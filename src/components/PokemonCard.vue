<template>
  <div class="pokemon-card" @click="navigateToDetail">
    <!-- Loading state for image -->
    <div v-if="imageLoading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <!-- Pokémon Image -->
    <div class="pokemon-image-container" v-show="!imageLoading">
      <img :src="pokemonImage" :alt="pokemon.name" class="pokemon-image" @load="imageLoading = false" @error="handleImageError" />
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <!-- Pokemon Name -->
      <div class="pokemon-name-section">
        <h3 class="pokemon-name">{{ pokemon.name }}</h3>
        <span class="pokemon-id">#{{ pokemonId }}</span>
      </div>

      <!-- Pokemon Types -->
      <div class="pokemon-types" v-if="pokemon.types && pokemon.types.length > 0">
        <div class="types-container">
          <span v-for="type in pokemon.types" :key="type.type.name" class="type-badge" :style="{ backgroundColor: getTypeColor(type.type.name) }">
            {{ type.type.name }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <button class="action-btn" @click.stop="navigateToDetail">View More</button>
    </div>
  </div>
</template>

<script>
import { API_CONFIG } from '@/configs/api';
import { typeColors } from '@/constants';

export default {
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageLoading: true,
    };
  },
  computed: {
    pokemonId() {
      return this.pokemon.id || this.extractIdFromUrl(this.pokemon.url);
    },
    pokemonImage() {
      const id = this.pokemonId;
      return `${API_CONFIG.POKE_IMAGE_BASE_URL}/${id}.png`;
    },
  },
  methods: {
    extractIdFromUrl(url) {
      const match = url.match(/\/(\d+)\/$/);
      return match ? match[1] : '1';
    },
    navigateToDetail() {
      this.$router.push(`/pokemon/${this.pokemonId}`);
    },
    handleImageError() {
      this.imageLoading = false;
    },
    getTypeColor(type) {
      return typeColors[type] || '#A8A878';
    },
  },
};
</script>

<style scoped>
.pokemon-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 280px;
  width: 100%;
}

.pokemon-card:hover {
  transform: translateY(-4px);
  border-color: #ff6b6b;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 107, 107, 0.2);
}

.loading-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #6c5ce7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pokemon-image-container {
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.pokemon-image {
  max-height: 160px;
  max-width: 160px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.card-content {
  padding: 12px;
}

.pokemon-name-section {
  text-align: center;
  margin-bottom: 16px;
}

.pokemon-name {
  font-size: 18px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 4px 0;
  text-transform: capitalize;
}

.pokemon-id {
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
}

.pokemon-info-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.pokemon-id,
.pokemon-height {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  text-transform: capitalize;
}

.pokemon-types {
  margin-bottom: 20px;
  text-align: center;
}

.types-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.type-badge {
  font-size: 11px;
  font-weight: 600;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  text-transform: capitalize;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
}

.action-btn:hover {
  background: linear-gradient(135deg, #ee5a24 0%, #d63031 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.action-btn:active {
  transform: translateY(0);
}

/* Info value styling */
.info-value {
  font-size: 12px;
  font-weight: 600;
  color: #212529;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pokemon-card {
    max-width: 100%;
  }

  .pokemon-image-container {
    height: 180px;
  }

  .pokemon-image {
    max-height: 140px;
    max-width: 140px;
  }

  .card-content {
    padding: 16px;
  }

  .pokemon-info-section {
    margin-bottom: 12px;
  }

  .pokemon-stats {
    margin-bottom: 12px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .pokemon-image-container {
    height: 160px;
  }

  .pokemon-image {
    max-height: 120px;
    max-width: 120px;
  }
}
</style>
