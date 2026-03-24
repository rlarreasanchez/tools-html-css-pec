/**
 * Módulo de Inicialización de AOS (Animate On Scroll)
 * para animaciones al hacer scroll en la página.
 */

import AOS from "aos";
import "aos/dist/aos.css";

export function initAOS(): void {
	AOS.init({
		duration: 800,
		easing: "ease-out-cubic",
		once: true,
		offset: 100,
		delay: 0,
		anchorPlacement: "top-bottom",
	});

	// Refresh AOS on window resize
	window.addEventListener("resize", () => {
		AOS.refresh();
	});
}
