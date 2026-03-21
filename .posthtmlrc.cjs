const fg = require("fast-glob");
const fs = require("fs");

const { RECIPES_PER_PAGE } = require("./src/config/pagination.config.json");
const { RECIPES_SLUG } = require("./src/config/recipes.config.json");

// Cargar todas las recetas desde los archivos saltándose template.json
const recipes = fg
	.sync("src/data/recipes/*.json")
	.filter((file) => !file.includes("template.json"))
	.map((file) => JSON.parse(fs.readFileSync(file)));

// Calcular el número total de páginas
const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);

// Crear array de páginas para la paginación
const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

// Extraer categorías únicas de las recetas
const categories = [...new Set(recipes.map((recipe) => recipe.category))].sort();

// Añadir información de paginación y enlaces a cada receta
const recipesWithPagination = recipes.map((recipe, index) => ({
	...recipe,
	link: `/${RECIPES_SLUG}${index + 1}`,
	index: index,
	page: Math.floor(index / RECIPES_PER_PAGE) + 1,
	nextLink: index < recipes.length - 1 ? `/${RECIPES_SLUG}${index + 2}` : null,
	nextLinkTitle: index < recipes.length - 1 ? recipes[index + 1].title : null,
	prevLink: index > 0 ? `/${RECIPES_SLUG}${index}` : null,
	prevLinkTitle: index > 0 ? recipes[index - 1].title : null,
	breadcrumb: [
		{
			name: "Inicio",
			url: "/",
			aria_label: "Ir a la página de inicio",
		},
		{
			name: "Recetas",
			url: "/categoria",
			aria_label: "Ir a la página de recetas",
		},
		{
			name: recipe.title,
		},
	],
}));

// Extraer todas las atribuciones de las recetas para la página de enlaces
const recipesAttributions = {
	labelledby: "recipe-images",
	caption: "Atribución de las imágenes utilizadas en las recetas",
	attributions: recipes.map((recipe) => recipe.attributions || []).flat(),
};

module.exports = {
	plugins: {
		"posthtml-extend": {
			root: "src",
		},
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
				recipesAttributions: recipesAttributions,
			},
		},
	},
};
