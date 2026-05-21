/**
 *
 * Módulo Principal
 *
 * Este módulo se encarga de inicializar la aplicación
 * Implementa lazy loading para módulos no críticos
 */

import { initNavigation } from "./navigation";

// Carga asíncrona de Font Awesome
async function loadFontAwesome(): Promise<void> {
	// @ts-expect-error - No tiene declaraciones de tipos
	await import("@fortawesome/fontawesome-free/css/all.min.css");
}

// Carga asíncrona de Swiper solo si el elemento existe en la página
async function loadSwiper(): Promise<void> {
	const swiperEl = document.querySelector(".recipes-swiper");
	if (swiperEl) {
		const { initSwiper } = await import("./swiper");
		initSwiper();
	}
}

// Carga asíncrona de AOS (animaciones)
async function loadAOS(): Promise<void> {
	const { initAOS } = await import("./aos-init");
	initAOS();
}

// Carga asíncrona de Newsletter solo si el formulario existe en la página
async function loadNewsletter(): Promise<void> {
	const newsletterForm = document.querySelector("#newsletter-form");
	if (newsletterForm) {
		const { initNewsletter } = await import("./newsletter");
		initNewsletter();
	}
}

// Carga asíncrona de Paginación solo si hay elementos con paginación
async function loadPagination(): Promise<void> {
	const paginationNav = document.querySelector(".pagination");
	const categoryList = document.querySelector(".category-list");
	if (paginationNav || categoryList) {
		const { initPagination } = await import("./pagination");
		initPagination();
	}
}

function initApp(): void {
	// Carga de Módulos críticos - cargar inmediatamente
	initNavigation();

	// Actualizar el año en el pie de página
	const yearEl = document.getElementById("current-year");
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear().toString();
	}

	// Carga de Módulos no críticos - cargar de forma diferida
	// Se utiliza requestIdleCallback si está disponible, sino setTimeout
	const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

	idle(async () => {
		await Promise.all([
			loadFontAwesome(),
			loadNewsletter(),
			loadPagination(),
			loadSwiper(),
			loadAOS(),
		]);
	});
}

// Inicializar la aplicación una vez que el DOM esté completamente cargado
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initApp);
} else {
	initApp();
}
