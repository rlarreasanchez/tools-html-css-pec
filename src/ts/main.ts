import { initNavigation } from "./navigation";

function initApp(): void {
	initNavigation();
}

// Inicializar la aplicación una vez que el DOM esté completamente cargado
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initApp);
} else {
	initApp();
}
