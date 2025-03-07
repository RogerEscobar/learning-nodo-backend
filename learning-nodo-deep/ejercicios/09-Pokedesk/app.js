// Mapeo de tipos de Pokémon a colores de fondo
const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

async function fetchPokemonList() {
  const pokemonList = document.getElementById("pokemonList");

  // Crear y mostrar indicador de carga
  const loadingIndicator = document.createElement("div");
  loadingIndicator.textContent = "Cargando Pokémon...";
  loadingIndicator.className =
    "col-span-full text-center py-6 text-white text-xl";
  pokemonList.appendChild(loadingIndicator);

  try {
    // Cargar Pokémon en lotes para mejorar el rendimiento
    for (let batch = 1; batch <= 151; batch += 20) {
      const promises = [];
      for (let i = batch; i < batch + 20 && i <= 151; i++) {
        promises.push(
          fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) =>
            res.json()
          )
        );
      }

      const pokemonBatch = await Promise.all(promises);

      pokemonBatch.forEach((pokemon) => {
        // Obtener el tipo principal para el color de fondo
        const mainType = pokemon.types[0].type.name;
        const cardColor = typeColors[mainType] || "#A8A878";

        // Crear tarjeta
        const card = document.createElement("div");
        card.className =
          "rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 duration-300";
        card.style.backgroundColor = cardColor;
        card.style.position = "relative"; // Permite posicionar la imagen fuera
        card.style.overflow = "visible"; // Evita que la imagen quede recortada
        card.style.paddingTop = "5px"; // Da más espacio en la parte superior
        card.style.marginBottom = "30px";
        card.style.marginRight = "10px";
        card.setAttribute("data-name", pokemon.name);

        // Crear imagen del Pokémon
        const img = document.createElement("img");
        img.src =
          pokemon.sprites.other["official-artwork"].front_default ||
          pokemon.sprites.front_default;
        img.alt = pokemon.name;
        img.style.width = "120px"; // Aumenta el tamaño de la imagen
        img.style.height = "auto";
        img.style.position = "absolute";
        img.style.top = "-20px"; // Hace que sobresalga arriba
        img.style.right = "-10px"; // Ajusta la posición
        img.style.transform = "scale(1.2)"; // Hace que la imagen sea más grande

        // Generar HTML para los tipos
        const typesHTML = pokemon.types
          .map((type) => `<span class="block">${type.type.name}</span>`)
          .join("");

        // Contenedor de información
        const infoContainer = document.createElement("div");
        infoContainer.className = "flex p-4 text-white";
        infoContainer.innerHTML = `
          <div class="flex-1">
            <h2 class="text-xl font-bold capitalize">${pokemon.name}</h2>
            <div class="mt-1 text-sm">
              ${typesHTML}
            </div>
          </div>
        `;

        // Agregar elementos a la tarjeta
        card.appendChild(infoContainer);
        card.appendChild(img); // Agregar la imagen para que sobresalga
        pokemonList.appendChild(card);
      });
    }

    // Eliminar el indicador de carga cuando se completa
    if (pokemonList.contains(loadingIndicator)) {
      pokemonList.removeChild(loadingIndicator);
    }
  } catch (error) {
    console.error("Error al obtener Pokemon:", error);
    loadingIndicator.textContent =
      "Error al cargar los Pokémon. Intenta recargar la página.";
    loadingIndicator.className =
      "col-span-full text-center py-6 text-red-200 text-xl";
  }
}

function filterPokemon() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const cards = document.querySelectorAll("#pokemonList > div");

  cards.forEach((card) => {
    if (card.classList.contains("text-center")) return; // Ignorar el indicador de carga

    const name = card.getAttribute("data-name");
    if (name && name.includes(searchInput)) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

// Iniciar la carga de Pokémon al cargar la página
fetchPokemonList();
