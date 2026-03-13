export function initNavigation(): void {
	const menuToggle = document.querySelector<HTMLButtonElement>(".site-header__menu-toggle");
	const nav = document.querySelector<HTMLElement>("#main-navigation");

	if (!menuToggle || !nav) return;

	// Se establece el enlace activo al cargar la página
	setActiveNavLink();

	menuToggle.addEventListener("click", () => {
		const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
		const newState = !isExpanded;

		menuToggle.setAttribute("aria-expanded", String(newState));
		menuToggle.setAttribute(
			"aria-label",
			newState ? "Cerrar menu de navegación" : "Abrir menu de navegación",
		);
		nav.classList.toggle("is-open", newState);

		// Si el menú se abre, cambiar el foco al primer enlace del menú para mejorar la accesibilidad
		if (newState) {
			const firstLink = nav.querySelector<HTMLAnchorElement>(".site-nav__link");
			firstLink?.focus();
		}
	});

	function setActiveNavLink(): void {
		const navLinks = document.querySelectorAll<HTMLAnchorElement>(".site-nav__link");
		let currentPath = window.location.pathname;

		// Se normaliza la ruta actual
		currentPath = normalizePath(currentPath);

		navLinks.forEach((link) => {
			// Se eliminan las clases activas existentes
			link.classList.remove("site-nav__link--active");
			link.removeAttribute("aria-current");

			// Se normaliza la ruta del enlace
			let linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
			if (linkPath === "") linkPath = "/";

			// Se compara la ruta del enlace con la ruta actual para determinar si es el enlace activo
			const isActive = linkPath === currentPath;
			if (isActive) {
				link.classList.add("site-nav__link--active");
				link.setAttribute("aria-current", "page");
			}
		});
	}

	// Función para normalizar las rutas eliminando barras finales e index.html
	function normalizePath(path: string): string {
		return path.replace(/\/$/, "").replace(/\/index\.html$/, "") || "/";
	}
}
