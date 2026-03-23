/**
 *
 * Módulo Principal
 *
 * Este módulo se encarga de inicializar la aplicación
 */

import { initNavigation } from "./navigation";
import { initNewsletter } from "./newsletter";
import { initPagination } from "./pagination";
import { initSwiper } from "./swiper";

import "@fortawesome/fontawesome-free/css/all.min.css";

function initApp(): void {
	initNavigation();
	initPagination();
	initNewsletter();
	initSwiper();

	// Actualizar el año en el pie de página
	const yearEl = document.getElementById("current-year");
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear().toString();
	}
}

// Inicializar la aplicación una vez que el DOM esté completamente cargado
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initApp);
} else {
	initApp();
}
