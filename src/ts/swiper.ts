import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";

// Estilos de Swiper
import "swiper/swiper.css";
import "swiper/modules/pagination.css";

export function initSwiper(): void {
	const swiperEl = document.querySelector(".recipes-swiper");

	if (!swiperEl) {
		console.warn("Swiper element not found");
		return;
	}

	const swiper = new Swiper(".recipes-swiper", {
		modules: [Pagination, Autoplay],
		slidesPerView: 1,
		spaceBetween: 24,
		loop: true,
		centeredSlides: false,
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true,
			dynamicBullets: true,
		},
		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 24,
			},
		},
		a11y: {
			prevSlideMessage: "Receta anterior",
			nextSlideMessage: "Siguiente receta",
			firstSlideMessage: "Primera receta",
			lastSlideMessage: "Última receta",
			paginationBulletMessage: "Ir a la receta {{index}}",
		},
	});
}
