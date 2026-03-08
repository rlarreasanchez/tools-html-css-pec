export function initNavigation(): void {
	const menuToggle = document.querySelector<HTMLButtonElement>(".site-header__menu-toggle");
	const nav = document.querySelector<HTMLElement>("#main-navigation");

	if (!menuToggle || !nav) return;

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
}
