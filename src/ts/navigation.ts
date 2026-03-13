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

		if (currentPath === "") currentPath = "/";

		navLinks.forEach((link) => {
			// Se eliminan las clases activas existentes
			link.classList.remove("site-nav__link--active");
			link.removeAttribute("aria-current");

			// Se compara el href del enlace con la ruta actual
			const linkPath = new URL(link.href, window.location.origin).pathname;
			const isActive = linkPath === currentPath;
			if (isActive) {
				link.classList.add("site-nav__link--active");
				link.setAttribute("aria-current", "page");
			}
		});
	}
}
