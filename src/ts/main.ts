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
}

// Inicializar la aplicación una vez que el DOM esté completamente cargado
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initApp);
} else {
	initApp();
}
