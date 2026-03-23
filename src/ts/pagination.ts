/**
 *
 * Módulo de Paginación
 *
 * Este módulo se encarga de gestionar la paginación de las recetas, incluyendo:
 * - Mostrar solo un número limitado de recetas por página
 * - Navegación entre páginas mediante botones de paginación
 * - Filtrado por categorías, que afecta a la paginación
 */

import { RECIPES_PER_PAGE } from "../config/pagination.config.json";

// Página actual (por defecto, la primera página)
let currentPage = 1;

// Filtros de categoría activos
const activeCategories = new Set<string>();

// Elementos del DOM relacionados con la paginación
let recipeItems: NodeListOf<HTMLElement>;
let paginationButtons: NodeListOf<HTMLButtonElement>;
let categoryList: HTMLElement | null;
let categoryFilterButtons: NodeListOf<HTMLButtonElement>;
let paginationNav: HTMLElement | null;
let clearFiltersBtn: HTMLElement | null;

// Obtiene los items filtrados según las categorías activas
function getFilteredItems(): HTMLElement[] {
	const allItems = Array.from(recipeItems);

	// Si no hay filtros activos, devolver todos los items
	if (activeCategories.size === 0) {
		return allItems;
	}

	// Filtrar por categorías activas
	return allItems.filter((item) => {
		const itemCategory = item.dataset.category || "";
		return activeCategories.has(itemCategory);
	});
}

// Recalcula y actualiza la paginación según los items filtrados
function updatePagination(): void {
	const filteredItems = getFilteredItems();
	const totalPages = Math.ceil(filteredItems.length / RECIPES_PER_PAGE);

	// Si la página actual es mayor que el total de páginas, volver a la primera
	if (currentPage > totalPages && totalPages > 0) {
		currentPage = 1;
	}

	// Actualizar botones de paginación
	if (paginationButtons) {
		paginationButtons.forEach((button) => {
			const buttonPage = parseInt(button.dataset.page || "1", 10);
			const pageItem = button.closest(".pagination__item") as HTMLElement;

			if (pageItem) {
				if (buttonPage <= totalPages) {
					pageItem.style.display = "";
				} else {
					pageItem.style.display = "none";
				}
			}
		});
	}
}

// Muestra la página especificada y oculta las demás
function showPage(pageNumber: number, shouldScroll: boolean = false): void {
	if (!recipeItems || recipeItems.length === 0) {
		console.warn("No se encontraron elementos de recetas para paginar");
		return;
	}

	const filteredItems = getFilteredItems();

	// Ocultar todos los items
	recipeItems.forEach((item) => {
		item.classList.remove("is-visible");
		item.setAttribute("aria-hidden", "true");
	});

	// Calcular qué items mostrar según la página y los filtros
	const startIndex = (pageNumber - 1) * RECIPES_PER_PAGE;
	const endIndex = startIndex + RECIPES_PER_PAGE;
	const itemsToShow = filteredItems.slice(startIndex, endIndex);

	itemsToShow.forEach((item) => {
		item.classList.add("is-visible");
		item.setAttribute("aria-hidden", "false");
	});

	// Actualizar el estado actual
	currentPage = pageNumber;

	// Actualizar los botones de paginación
	updatePaginationButtons();

	// Hacer scroll suave al inicio de la lista solo si se solicita
	if (shouldScroll && categoryList) {
		categoryList.scrollIntoView({ behavior: "smooth", block: "start" });
	}
}

// Actualiza el estado de los botones de paginación (activo/inactivo)
function updatePaginationButtons(): void {
	if (!paginationButtons || paginationButtons.length === 0) {
		return;
	}

	paginationButtons.forEach((button) => {
		const buttonPage = parseInt(button.dataset.page || "1", 10);
		const isActive = buttonPage === currentPage;

		// Actualizar clases
		if (isActive) {
			button.classList.add("is-active");
			button.setAttribute("aria-current", "page");
			button.setAttribute("aria-label", `Página ${buttonPage}, página actual`);
		} else {
			button.classList.remove("is-active");
			button.removeAttribute("aria-current");
			button.setAttribute("aria-label", `Página ${buttonPage}`);
		}
	});
}

// Manejador de clicks en los botones de paginación
function handlePaginationClick(event: Event): void {
	const target = event.currentTarget as HTMLButtonElement;
	const pageNumber = parseInt(target.dataset.page || "1", 10);

	if (pageNumber !== currentPage) {
		showPage(pageNumber, true);
	}
}

// Añade event listeners a los botones de paginación
function attachPaginationListeners(): void {
	if (!paginationButtons || paginationButtons.length === 0) {
		console.warn("No se encontraron botones de paginación");
		return;
	}

	paginationButtons.forEach((button) => {
		button.addEventListener("click", handlePaginationClick);
	});
}

// Actualiza el estado visual de los botones de filtro de categoría
function updateCategoryFilterButtons(): void {
	if (!categoryFilterButtons || categoryFilterButtons.length === 0) {
		return;
	}

	categoryFilterButtons.forEach((button) => {
		const category = button.dataset.category || "";
		const isActive = activeCategories.has(category);

		if (isActive) {
			button.classList.add("is-active");
			button.setAttribute("aria-pressed", "true");
		} else {
			button.classList.remove("is-active");
			button.setAttribute("aria-pressed", "false");
		}
	});

	// Mostrar u ocultar el botón de limpiar filtros
	if (clearFiltersBtn) {
		if (activeCategories.size > 0) {
			clearFiltersBtn.classList.add("is-visible");
		} else {
			clearFiltersBtn.classList.remove("is-visible");
		}
	}
}

// Maneja el click en un botón de filtro de categoría
function handleCategoryFilterClick(event: Event): void {
	const target = event.currentTarget as HTMLButtonElement;
	const category = target.dataset.category || "";

	if (!category) return;

	// Toggle: si está activo, desactivar; si no, activar
	if (activeCategories.has(category)) {
		activeCategories.delete(category);
	} else {
		activeCategories.add(category);
	}

	// Actualizar estado visual de los botones de filtro
	updateCategoryFilterButtons();

	// Recalcular paginación
	updatePagination();

	// Mostrar la primera página con los nuevos filtros
	showPage(1, true);
}

// Añade event listeners a los botones de filtro de categoría
function attachCategoryFilterListeners(): void {
	if (!categoryFilterButtons || categoryFilterButtons.length === 0) {
		return;
	}

	categoryFilterButtons.forEach((button) => {
		button.addEventListener("click", handleCategoryFilterClick);
	});
}

// Limpia todos los filtros activos
function clearAllFilters(): void {
	// Limpiar el Set de categorías activas
	activeCategories.clear();

	// Actualizar estado visual de los botones
	updateCategoryFilterButtons();

	// Recalcular paginación
	updatePagination();

	// Mostrar la primera página sin filtros
	showPage(1, true);
}

// Función de inicialización de la paginación
export function initPagination(): void {
	// Obtener elementos del DOM
	categoryList = document.getElementById("category-list");
	paginationNav = document.getElementById("pagination-nav");
	clearFiltersBtn = document.getElementById("clear-filters-btn");
	recipeItems = document.querySelectorAll<HTMLElement>("[data-page]");
	paginationButtons = document.querySelectorAll<HTMLButtonElement>(".pagination__link");
	categoryFilterButtons = document.querySelectorAll<HTMLButtonElement>(".category-filters__button");

	// Verificar que existen los elementos necesarios
	if (!recipeItems || recipeItems.length === 0) {
		console.warn("No se encontraron items de recetas. La paginación no se inicializará.");
		return;
	}

	if (!paginationButtons || paginationButtons.length === 0) {
		console.warn("No se encontraron botones de paginación. La paginación no se inicializará.");
		return;
	}

	// Añadir event listeners
	attachPaginationListeners();
	attachCategoryFilterListeners();

	// Añadir event listener al botón de limpiar filtros
	if (clearFiltersBtn) {
		clearFiltersBtn.addEventListener("click", clearAllFilters);
	}

	// Inicializar estado de los filtros
	updateCategoryFilterButtons();

	// Actualizar paginación inicial
	updatePagination();

	// Mostrar la primera página por defecto
	showPage(1);
}
