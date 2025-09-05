<template>
  <div class="pokemon-detail">
    <!-- Loading State -->
    <LoadingSpinner v-if="loading" height="100vh" message="Loading Pokémon details..." />
    <!-- Pokémon Detail Content -->
    <div v-else-if="pokemon" class="container-fluid">
      <div class="container-fluid">
        <!-- Back Button -->
        <div class="row align-items-center">
          <!-- Left Panel - Pokemon Display -->
          <div class="col-lg-8 col-md-7 col-12 d-flex flex-column align-items-center justify-content-center">
            <div class="back-container">
              <button class="back-btn" @click="goBack" @touchstart="goBack">
                <i class="bi bi-arrow-left me-2"></i>
                Back to PokéDex
              </button>
            </div>
            <div class="pokemon-hero mb-4">
              <div v-if="isImageLoading" class="loading-spinner"></div>
              <img
                v-show="!isImageLoading"
                :src="pokemonImage"
                :alt="pokemon.name"
                class="img-fluid hero-image"
                @load="handleImageLoad"
                @error="handleImageError"
              />
            </div>
            <div class="text-center">
              <div class="d-flex align-items-center justify-content-center mb-3">
                <h1 class="pokemon-title mb-0">#{{ pokemon.id }} {{ pokemon.name }}</h1>
                <button class="btn btn-sound ms-2" @click="playPokemonCry" title="Play Pokémon cry" :class="{ playing: isPlayingCry }">
                  <i class="bi" :class="isPlayingCry ? 'bi-volume-up-fill' : 'bi-volume-up'"></i>
                </button>
              </div>
              <div class="d-flex gap-2 justify-content-center">
                <span
                  v-for="type in pokemon.types"
                  :key="type.type.name"
                  class="badge type-badge"
                  :style="{ backgroundColor: getTypeColor(type.type.name) }"
                >
                  {{ type.type.name }}
                </span>
              </div>
            </div>
            <!-- Evolution Chain (Moved & Beautified) -->
            <div class="mb-4 mt-4 w-100">
              <h4 class="evolutions-title mb-3 text-center">Evolutions</h4>
              <div class="text-center">
                <div
                  v-if="evolutionChain && evolutionChain.length > 0"
                  class="d-flex flex-row justify-content-center align-items-center gap-4 flex-wrap evolution-row"
                >
                  <div v-for="(evolution, index) in evolutionChain" :key="evolution.id" class="evolution-card text-center p-3">
                    <div class="evolution-img-wrap mb-2" @click="goToPokemon(evolution.id)">
                      <img
                        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`"
                        :alt="evolution.name"
                        class="evolution-img"
                        @error="handleEvolutionImageError"
                      />
                    </div>
                    <div class="evolution-info">
                      <div class="fw-bold evolution-name">{{ evolution.name }}</div>
                      <div class="d-flex gap-1 justify-content-center mt-1">
                        <span
                          v-for="type in evolution.types"
                          :key="type.type.name"
                          class="badge type-badge"
                          :style="{ backgroundColor: getTypeColor(type.type.name) }"
                        >
                          {{ type.type.name }}
                        </span>
                      </div>
                    </div>
                    <div v-if="index < evolutionChain.length - 1" class="evolution-arrow-horizontal">
                      <i class="bi bi-arrow-right"></i>
                    </div>
                  </div>
                </div>
                <div v-else-if="evolutionChain === null" class="text-center text-muted">
                  <i class="bi bi-hourglass-split me-2"></i>
                  Loading evolution chain...
                </div>
                <div v-else class="text-center text-muted">
                  <i class="bi bi-info-circle me-2"></i>
                  This Pokémon has no evolutions.
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Information Card -->
          <div class="col-lg-4 col-md-5 col-12">
            <div class="card info-card h-100">
              <div class="card-body">
                <!-- Description -->
                <div class="mb-4">
                  <h3 class="section-title mb-3">Description</h3>
                  <p class="text-muted mb-2">
                    {{ pokemon.name }} is a fascinating Pokémon with unique abilities and characteristics. This Pokémon has captured the hearts of
                    trainers worldwide with its distinctive features and powerful moves.
                  </p>
                  <a href="#" class="text-warning text-decoration-none fw-semibold">+ Read more</a>
                </div>

                <!-- Characteristics -->
                <div class="mb-4">
                  <h3 class="section-title mb-3">Characteristics</h3>
                  <div class="row g-2">
                    <div class="col-6">
                      <div class="char-item">
                        <span class="char-label">Height</span>
                        <span class="char-value">{{ (pokemon.height / 10).toFixed(1) }}m</span>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="char-item">
                        <span class="char-label">Weight</span>
                        <span class="char-value">{{ (pokemon.weight / 10).toFixed(1) }}kg</span>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="char-item">
                        <span class="char-label">Base Exp</span>
                        <span class="char-value">{{ pokemon.base_experience || 'N/A' }}</span>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="char-item">
                        <span class="char-label">Abilities</span>
                        <span class="char-value">{{ pokemon.abilities[0]?.ability.name || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Stats -->
                <div class="mb-4">
                  <h3 class="section-title mb-3">Stats</h3>
                  <div class="stats-container">
                    <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-row mb-2">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="stat-name">{{ stat.stat.name }}</span>
                        <span class="stat-value">{{ stat.base_stat }}</span>
                      </div>
                      <div class="progress" style="height: 8px">
                        <div class="progress-bar stat-fill" :style="{ width: `${(stat.base_stat / 255) * 100}%` }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Moves -->
                <div class="mb-4">
                  <h3 class="section-title mb-3">Moves ({{ pokemon.moves.length }})</h3>
                  <div class="d-flex flex-wrap gap-1">
                    <span v-for="move in pokemon.moves.slice(0, 8)" :key="move.move.name" class="badge bg-light text-dark move-tag">
                      {{ move.move.name }}
                    </span>
                    <span v-if="pokemon.moves.length > 8" class="badge bg-warning text-white">+{{ pokemon.moves.length - 8 }} more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="container text-center py-5">
      <div class="error-state">
        <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
        <h3>Pokémon not found</h3>
        <p class="text-muted">The Pokémon you're looking for doesn't exist.</p>
        <button class="btn btn-primary" @click="$router.push('/')">Back to PokéDex</button>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokeStore } from '@/stores';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { typeColors } from '@/constants';
import { API_CONFIG } from '@/configs/api';

export default {
  name: 'PokemonDetail',
  components: {
    LoadingSpinner,
  },
  setup() {
    const pokeStore = usePokeStore();
    return {
      pokeStore,
    };
  },
  data() {
    return {
      audio: null,
      isPlayingCry: false,
      isImageLoading: true,
    };
  },
  computed: {
    loading() {
      return this.pokeStore.loading;
    },
    pokemon() {
      const id = this.$route.params.id;
      return this.pokeStore.pokeDetails[id];
    },
    pokemonImage() {
      if (!this.pokemon) return '';
      return `${API_CONFIG.POKE_GIF_BASE_URL}/${this.pokemon.name}.gif`;
      // return `${API_CONFIG.POKE_IMAGE_BASE_URL}/${this.pokemon.id}.png`;
    },
    evolutionChain() {
      const id = this.$route.params.id;
      const chain = this.pokeStore.evolutionChains[id];
      if (!chain) return null;
      if (!chain.evolutionDetails) return [];
      return chain.evolutionDetails;
    },
  },
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push('/');
      }
    },
    async fetchPokemonDetails() {
      const id = this.$route.params.id;
      if (!this.pokemon) {
        try {
          await this.pokeStore.fetchPokeDetail(id);
        } catch (error) {
          console.error('Error fetching Pokémon details:', error);
        }
      } else {
        // If Pokemon exists but evolution chain doesn't, fetch it
        if (!this.pokeStore.evolutionChains[id]) {
          console.log('Pokemon exists but no evolution chain, fetching...');
          await this.pokeStore.fetchEvolutionChain(id);
        }
      }
    },
    handleImageError(event) {
      event.target.src = `${API_CONFIG.POKE_PLACEHOLDER_BASE_URL}/400x400?text=Pokemon+Image`;
    },
    handleEvolutionImageError(event) {
      event.target.src = `${API_CONFIG.POKE_PLACEHOLDER_BASE_URL}/100x100?text=Pokemon`;
    },
    async goToPokemon(id) {
      await this.$router.push(`/pokemon/${id}`);
    },
    getTypeColor(type) {
      return typeColors[type] || '#A8A878';
    },
    playPokemonCry() {
      if (this.isPlayingCry) return; // Prevent multiple clicks
      this.isPlayingCry = true;
      if (!this.audio) {
        this.audio = new Audio();
        this.audio.addEventListener('ended', () => {
          this.isPlayingCry = false;
        });
        this.audio.addEventListener('error', () => {
          console.error('Error playing Pokémon cry');
          this.isPlayingCry = false;
        });
      }
      this.audio.src = `${API_CONFIG.POKE_AUDIO_BASE_URL}/${this.pokemon.name.toLowerCase()}.mp3`;
      this.audio.play().catch((error) => {
        console.error('Error playing Pokémon cry:', error);
        this.isPlayingCry = false;
      });
    },
    handleImageLoad() {
      this.isImageLoading = false;
    },
    handleImageError(event) {
      this.isImageLoading = false;
      event.target.src = this.fallbackImage;
    },
  },
  async mounted() {
    await this.fetchPokemonDetails();
  },
  watch: {
    '$route.params.id'() {
      console.log('Route changed, fetching new Pokemon details');
      this.fetchPokemonDetails();
    },
  },
};
</script>

<style scoped>
.pokemon-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem 0;
}

.back-container {
  margin-bottom: 2rem;
  padding: 0 1rem;
  display: block;
  text-align: left !important;
  width: 100%;
}

.back-btn {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
  color: #6c757d;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.9rem;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
}

.back-btn:hover {
  background: white;
  color: #ffb300;
  border-color: #ffb300;
  transform: translateX(-4px);
}

/* Pokemon Hero */
.pokemon-hero {
  background: linear-gradient(135deg, #fdfdfc 0%, #dadada 50%, #ffffff 100%);
  border-radius: 30px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.pokemon-hero::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 60px;
  background: linear-gradient(135deg, #fdfdfc 0%, #dadada 50%, #ffffff 100%);
  border-radius: 50% 50% 0 0;
  z-index: 1;
}

.loading-spinner {
  width: 300px;
  height: 300px;
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #777;
}

.loading-spinner::after {
  content: '';
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hero-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
  position: relative;
  z-index: 2;
}

/* Pokemon Title */
.pokemon-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #f57f17;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-sound {
  background: linear-gradient(135deg, #ffb300 0%, #ff9800 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.4);
  transition: all 0.2s ease;
  padding: 0;
  margin-top: 8px;
}

.btn-sound:hover {
  background: linear-gradient(135deg, #ff9800 0%, #ff7800 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.5);
  color: white;
}

.btn-sound:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 152, 0, 0.4);
}

.btn-sound i {
  font-size: 1.2rem;
}

.btn-sound.playing {
  background: linear-gradient(135deg, #ff7800 0%, #ff5722 100%);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
  }
}

/* Type Badge */
.type-badge {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-transform: capitalize;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Info Card */
.info-card {
  border: none;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: white;
}

/* Section Title */
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #212529;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%);
  border-radius: 2px;
}

.evolutions-title {
  font-size: 1.2rem;
  font-weight: 700;
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.evolutions-title::before {
  content: '';
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -8px;
  width: 70px;
  height: 5px;
  background: #ffc107;
  border-radius: 4px;
}

/* Characteristic Items */
.char-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.char-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 600;
}

.char-value {
  font-size: 1rem;
  font-weight: 700;
  color: #212529;
}

/* Stats */
.stat-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #212529;
}

.stat-fill {
  background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%);
}

/* Move Tags */
.move-tag {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

/* Evolution Chain (Horizontal Card Style) */
.evolution-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  justify-items: center;
  align-items: stretch;
  margin-bottom: 1rem;
  width: 100%;
}
.evolution-card {
  background: #fffbe7;
  border-radius: 18px;
  border: 2px solid #ffe082;
  box-shadow: 0 4px 16px rgba(255, 193, 7, 0.08);
  min-width: 140px;
  max-width: 180px;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.evolution-card:hover {
  border-color: #ffb300;
  box-shadow: 0 8px 32px rgba(255, 179, 0, 0.18);
  transform: translateY(-3px) scale(1.04);
}
.evolution-img-wrap {
  background: linear-gradient(135deg, #fffde7 0%, #ffe082 100%);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}
.evolution-img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.08);
}
.evolution-name {
  font-size: 1rem;
  font-weight: 700;
  color: #f57f17;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
  letter-spacing: 0.5px;
}
.evolution-arrow-horizontal {
  position: absolute;
  right: -28px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffb300;
  font-size: 2rem;
  z-index: 2;
  pointer-events: none;
}
@media (max-width: 992px) {
  .evolution-row {
    gap: 1rem !important;
  }
  .evolution-card {
    min-width: 110px;
    max-width: 140px;
  }
  .evolution-img {
    width: 50px;
    height: 50px;
  }
  .evolution-arrow-horizontal {
    right: -18px;
    font-size: 1.5rem;
  }
}
@media (max-width: 576px) {
  .evolution-row {
    gap: 0.5rem !important;
  }
  .evolution-card {
    min-width: 90px;
    max-width: 110px;
    padding: 0.5rem !important;
  }
  .evolution-img {
    width: 36px;
    height: 36px;
  }
  .evolution-arrow-horizontal {
    right: -21px;
    font-size: 1.1rem;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .pokemon-detail {
    padding: 1rem 0;
  }

  .pokemon-detail-image {
    max-height: 200px;
    max-width: 200px;
  }

  .pokemon-image-container {
    padding: 1rem;
  }

  .evolution-row {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    gap: 1rem !important;
    justify-content: center !important;
  }
  .evolution-card {
    min-width: 120px;
    max-width: 45vw;
    margin-bottom: 1rem;
    flex: 1 1 120px;
  }
  .evolution-info .d-flex {
    flex-wrap: wrap !important;
    gap: 0.25rem !important;
  }
  .type-badge {
    margin: 2px 2px 2px 0;
    padding: 4px 8px;
    font-size: 11px;
  }
  .pokemon-hero {
    padding: 2rem 0.5rem;
  }
  .hero-image {
    width: 180px;
    height: 180px;
  }
  .pokemon-title {
    font-size: 1.5rem;
  }
  .evolution-row {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem !important;
    justify-items: center !important;
    align-items: stretch !important;
  }
  .evolution-card {
    min-width: 90px;
    max-width: 100%;
    width: 100%;
    padding: 0.75rem 0.5rem;
    box-sizing: border-box;
  }
  .evolution-img {
    width: 70px;
    height: 70px;
  }
  .evolution-arrow-horizontal {
    font-size: 1.5rem;
    margin: 0.5rem 0;
    display: flex;
    justify-content: center;
  }
  .evolutions-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  .info-card {
    margin-top: 2rem;
  }
  .evolution-pokemon {
    padding: 0.5rem;
  }
  .evolution-image {
    width: 50px;
    height: 50px;
  }
  .evolution-name {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .pokemon-detail {
    padding: 0.5rem 0;
  }

  .hero-image {
    width: 200px;
    height: 200px;
  }

  .pokemon-title {
    font-size: 1.75rem;
  }

  .pokemon-hero {
    padding: 1.5rem 1rem;
  }

  .back-container {
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }

  .back-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    background: rgba(255, 255, 255, 0.98);
    border: 2px solid #ffb300;
    color: #ffb300;
    font-weight: 700;
  }

  .back-btn:hover {
    background: #ffb300;
    color: white;
  }
}

.pokemon-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.pokemon-card:hover {
  transform: translateY(-2px);
  border-color: #ff6b6b;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.detail-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-2px);
  border-color: #ff6b6b;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.card-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.card-header h4 {
  margin: 0;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ee5a24 0%, #d63031 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
  color: white;
}

.pokemon-image-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: inset 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.pokemon-detail-image {
  max-height: 300px;
  max-width: 300px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.stats-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #212529;
}

.type-badge {
  font-size: 12px;
  font-weight: 600;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  text-transform: capitalize;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  margin: 0 4px 4px 0;
  display: inline-block;
}

.abilities-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
}

.abilities-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.ability-badge {
  font-size: 12px;
  font-weight: 600;
  color: #212529;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  text-transform: capitalize;
}

.hidden-ability {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-color: #ffc107;
  color: #856404;
}

.hidden-ability i {
  color: #ffc107;
}

.progress-bar-container {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.moves-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.move-badge {
  font-size: 12px;
  font-weight: 600;
  color: #212529;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  text-transform: capitalize;
  transition: all 0.3s ease;
}

.move-badge:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.more-badge {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.error-state {
  background: white;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid #e9ecef;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pokemon-detail {
    padding: 1rem 0;
  }

  .pokemon-detail-image {
    max-height: 200px;
    max-width: 200px;
  }

  .pokemon-image-container {
    padding: 1rem;
  }
}
</style>
