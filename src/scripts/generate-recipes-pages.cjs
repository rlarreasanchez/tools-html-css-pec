/**
 * Este script genera una página HTML para cada receta de la carpeta src/data/recipes
 * Cada página se coloca en la carpeta src/pages/{slug-recetas}1.html, src/pages/{slug-recetas}2.html, etc.
 * y renderiza el layout detail-page-layout.html con los datos de la receta correspondiente.
 */

const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");

const { RECIPES_SLUG } = require("../config/recipes.config.json");

// Cargar recetas desde archivos JSON, excluyendo template.json
const recipes = fg
	.sync("src/data/recipes/*.json")
	.filter((file) => !file.includes("template.json"))
	.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));

// Carpeta base para las páginas de recetas
const baseDir = path.join("src", "pages");

// Asegurar que existe la carpeta base para las páginas de recetas
fs.mkdirSync(baseDir, { recursive: true });

// Eliminar páginas antiguas
const oldPages = fg.sync(`src/pages/${RECIPES_SLUG}*.html`);
oldPages.forEach((file) => fs.unlinkSync(path.resolve(file)));

// Generar una página HTML para cada receta
recipes.forEach((_, index) => {
	const slug = RECIPES_SLUG + (index + 1);
	const filePath = path.join(baseDir, `${slug}.html`);

	const html = `<each loop="recipe in recipes">
	<if condition="recipe.link === '/${slug}'">
		<scope with="recipe">
			<include src="layouts/detail-page-layout.html"></include>
		</scope>
	</if>
</each>
`;

	fs.writeFileSync(filePath, html);
});
