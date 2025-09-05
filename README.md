# Pokémon - Vue.js Pokémon Web App

A beautiful and responsive Pokémon web application built with Vue.js, Bootstrap, and Pinia for state management. Explore the world of Pokémon with a modern, user-friendly interface.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pokemon
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
pokemon/
├── public/               # Static public assets
├── src/                  # Source code
│   ├── assets/           # Static files (images, fonts, etc.)
│   ├── components/       # Reusable Vue components
│   ├── configs/          # App-wide configuration (e.g., API base URLs)
│   ├── constants/        # Constants and enums
│   ├── routers/          # Vue Router configurations
│   ├── services/         # API service logic (e.g., fetch wrapper)
│   ├── stores/           # State management (e.g., Pinia/Vuex)
│   ├── views/            # Page-level components
│   ├── App.vue           # Root Vue component
│   ├── main.js           # Application entry point
│   └── style.css         # Global CSS styles
├── test/                 # Unit tests
│   └── pokeService.test.js
├── index.html            # HTML entry file
├── package.json          # Project metadata and dependencies
├── README.md             # Project documentation
└── vite.config.js        # Vite configuration file
```

## API Integration

The app uses the [PokéAPI](https://pokeapi.co/) to fetch Pokémon data:

- **List Endpoint**: `https://pokeapi.co/api/v2/pokemon?limit=151&offset=0`
- **Detail Endpoint**: `https://pokeapi.co/api/v2/pokemon/{id}`
- **Image Source**: Official artwork from PokeAPI sprites

Several base URLs are used to retrieve different types of Pokémon-related content:

- `https://play.pokemonshowdown.com/audio/cries` – Source for Pokémon cry (sound) files.
- `https://projectpokemon.org/images/normal-sprite` – Animated `.gif` sprites of Pokémon.
- `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork` – Official artwork images of Pokémon.
- `https://via.placeholder.com` – Placeholder image service used when a Pokémon image is unavailable.

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [Vue.js](https://vuejs.org/) for the reactive framework
- [Pinia](https://pinia.vuejs.org/) for state management
