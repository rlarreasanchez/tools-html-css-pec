import { initNavigation } from "./navigation";
import { initPagination } from "./pagination";

import "@fortawesome/fontawesome-free/css/all.min.css";

function initApp(): void {
	initNavigation();
	initPagination();
}

// Inicializar la aplicación una vez que el DOM esté completamente cargado
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initApp);
} else {
	initApp();
}
