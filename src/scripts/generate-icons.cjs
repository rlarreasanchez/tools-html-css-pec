/**
 * Script para extraer iconos SVG específicos de FontAwesome
 * y generar un sprite SVG optimizado en tiempo de build
 */

const fs = require("fs");
const path = require("path");
const { getIconData, iconToSVG } = require("@iconify/utils");

// Iconos usados en el proyecto
const ICONS_USED = {
	// Solid (fas)
	solid: [
		"house",
		"utensils",
		"book-open",
		"link",
		"paper-plane",
		"circle-check",
		"users",
		"chevron-left",
		"chevron-right",
		"wheat-awn",
		"fish",
		"cake-candles",
		"bowl-rice",
		"envelope",
		"arrow-up-right-from-square",
		"xmark",
		"robot",
		"image",
		"video",
		"file-contract",
	],
	// Regular (far)
	regular: ["clock", "star"],
	// Brands (fab)
	brands: ["instagram", "youtube"],
};

// Mapeo de tipo a prefijo de Iconify
const TYPE_TO_PREFIX = {
	solid: "fa6-solid",
	regular: "fa6-regular",
	brands: "fa6-brands",
};

// Directorios de salida
const OUTPUT_DIR = path.join(process.cwd(), "src", "images", "icons");
const SPRITE_FILE = path.join(OUTPUT_DIR, "icons-sprite.svg");

// Crear directorio si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Carga un conjunto de iconos desde @iconify/json
 */
function loadIconSet(prefix) {
	const iconSetPath = require.resolve(`@iconify/json/json/${prefix}.json`);
	const iconSet = JSON.parse(fs.readFileSync(iconSetPath, "utf8"));
	return iconSet;
}

/**
 * Genera el sprite SVG con todos los iconos como <symbol>
 */
function generateSprite(allIcons) {
	const symbols = allIcons
		.map(({ id, iconData }) => {
			const renderData = iconToSVG(iconData);

			return `<symbol id="${id}" viewBox="${renderData.attributes.viewBox}">${renderData.body}</symbol>`;
		})
		.join("\n    ");

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
  <defs>
    ${symbols}
  </defs>
</svg>`;
}

/**
 * Genera el partial HTML con el sprite de iconos
 * El div#icon-sprite-container se incluye en el layout vía PostHTML include
 */
function generateIconSpriteHTML(spriteSVG) {
	// Extraer el contenido del SVG (sin la declaración XML y envoltorio exterior)
	const svgContent = spriteSVG
		.replace(/<\?xml[^>]*\?>\s*/, "")
		.replace(/<svg([^>]*)>/, "<svg$1>")
		.replace(/<\/svg>\s*$/, "</svg>");

	return `<!-- Sprite de iconos SVG generado automáticamente en build time -->
<div id="icon-sprite-container" style="display: none" aria-hidden="true">
\t${svgContent}
</div>
`;
}

const allIcons = [];

// Procesar cada tipo de icono
Object.entries(ICONS_USED).forEach(([type, icons]) => {
	const prefix = TYPE_TO_PREFIX[type];

	try {
		const iconSet = loadIconSet(prefix);

		icons.forEach((iconName) => {
			const iconData = getIconData(iconSet, iconName);

			if (!iconData) {
				console.warn(`Icono no encontrado: ${iconName}`);
				return;
			}

			const iconId = `fa-${iconName}`;

			// Agregar al array para generación del sprite
			allIcons.push({ id: iconId, name: iconName, type, iconData });
		});
	} catch (error) {
		console.error(`Error cargando ${prefix}:`, error.message);
	}
});

// Generar sprite SVG
const spriteSVG = generateSprite(allIcons);
fs.writeFileSync(SPRITE_FILE, spriteSVG, "utf8");
const spriteSize = Buffer.byteLength(spriteSVG, "utf8");

// Generar archivo HTML con el sprite
const htmlContent = generateIconSpriteHTML(spriteSVG);
const htmlPath = path.join(__dirname, "..", "partials", "icon-sprite.html");
fs.writeFileSync(htmlPath, htmlContent, "utf8");
