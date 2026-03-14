// Página actual (por defecto, la primera página)
let currentPage = 1;

// Elementos del DOM relacionados con la paginación
let recipeItems: NodeListOf<HTMLElement>;
let paginationButtons: NodeListOf<HTMLButtonElement>;
let categoryList: HTMLElement | null;

// Muestra la página especificada y oculta las demás
function showPage(pageNumber: number, shouldScroll: boolean = false): void {
	if (!recipeItems || recipeItems.length === 0) {
		console.warn("No se encontraron elementos de recetas para paginar");
		return;
	}

	// Ocultar todos los items
	recipeItems.forEach((item) => {
		item.classList.remove("is-visible");
		item.setAttribute("aria-hidden", "true");
	});

	// Mostrar solo los items de la página actual
	const itemsToShow = Array.from(recipeItems).filter((item) => {
		const itemPage = parseInt(item.dataset.page || "1", 10);
		return itemPage === pageNumber;
	});

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

// Función de inicialización de la paginación
export function initPagination(): void {
	// Obtener elementos del DOM
	categoryList = document.getElementById("category-list");
	recipeItems = document.querySelectorAll<HTMLElement>("[data-page]");
	paginationButtons = document.querySelectorAll<HTMLButtonElement>(".pagination__link");

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

	// Mostrar la primera página por defecto
	showPage(1);
}
