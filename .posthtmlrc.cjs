const recipes = require("./src/data/recipes.json");
const { RECIPES_PER_PAGE } = require("./src/config/pagination.config.json");

// Calcular el número total de páginas
const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);

// Crear array de páginas para la paginación
const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

// Extraer categorías únicas de las recetas
const categories = [...new Set(recipes.map((recipe) => recipe.category))].sort();

// Añadir índice y número de página a cada receta
const recipesWithPagination = recipes.map((recipe, index) => ({
	...recipe,
	index: index,
	page: Math.floor(index / RECIPES_PER_PAGE) + 1,
}));

module.exports = {
	plugins: {
		"posthtml-include": {
			root: "src",
		},
		"posthtml-expressions": {
			locals: {
				recipes: recipesWithPagination,
				categories: categories,
				pagination: {
					totalPages,
					pages,
					recipesPerPage: RECIPES_PER_PAGE,
				},
			},
		},
	},
};
