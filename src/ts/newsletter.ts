/**
 *
 * Módulo de Newsletter
 *
 * Este módulo se encarga de gestionar el formulario de suscripción al newsletter, incluyendo:
 * - Validación de campos (nombre, correo electrónico, consentimiento)
 * - Manejo de errores con mensajes
 */

interface FormElements {
	form: HTMLFormElement;
	nameInput: HTMLInputElement;
	emailInput: HTMLInputElement;
	consentCheckbox: HTMLInputElement;
	nameError: HTMLSpanElement;
	emailError: HTMLSpanElement;
	consentError: HTMLSpanElement;
	successMessage: HTMLElement;
}

// Función para obtener los elementos del formulario
const getFormElements = (): FormElements | null => {
	const form = document.querySelector<HTMLFormElement>("#newsletter-form");
	const nameInput = document.querySelector<HTMLInputElement>("#newsletter-name");
	const emailInput = document.querySelector<HTMLInputElement>("#newsletter-email");
	const consentCheckbox = document.querySelector<HTMLInputElement>("#newsletter-consent");
	const nameError = document.querySelector<HTMLSpanElement>("#newsletter-name-error");
	const emailError = document.querySelector<HTMLSpanElement>("#newsletter-email-error");
	const consentError = document.querySelector<HTMLSpanElement>("#newsletter-consent-error");
	const successMessage = document.querySelector<HTMLElement>("#newsletter-success");

	if (
		!form ||
		!nameInput ||
		!emailInput ||
		!consentCheckbox ||
		!nameError ||
		!emailError ||
		!consentError ||
		!successMessage
	) {
		return null;
	}

	return {
		form,
		nameInput,
		emailInput,
		consentCheckbox,
		nameError,
		emailError,
		consentError,
		successMessage,
	};
};

// Funciones para mostrar errores
const setError = (input: HTMLInputElement, errorSpan: HTMLSpanElement, errorMessage: string) => {
	input.setAttribute("aria-invalid", "true");
	errorSpan.textContent = errorMessage;
};

// Función para limpiar errores
const clearError = (input: HTMLInputElement, errorSpan: HTMLSpanElement) => {
	input.removeAttribute("aria-invalid");
	errorSpan.textContent = "";
};

// Funciones de validación
const validateFieldRequired = (input: HTMLInputElement, errorSpan: HTMLSpanElement) => {
	if (input.value.trim() === "") {
		setError(input, errorSpan, "Este campo es obligatorio.");
		return false;
	} else {
		clearError(input, errorSpan);
		return true;
	}
};

const validateFieldMinLength = (
	input: HTMLInputElement,
	errorSpan: HTMLSpanElement,
	minLength: number,
) => {
	if (input.value.trim().length < minLength) {
		setError(input, errorSpan, `Este campo debe tener al menos ${minLength} caracteres.`);
		return false;
	} else {
		clearError(input, errorSpan);
		return true;
	}
};

const validateEmailFormat = (input: HTMLInputElement, errorSpan: HTMLSpanElement) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(input.value.trim())) {
		setError(input, errorSpan, "Por favor, introduce un correo electrónico válido.");
		return false;
	} else {
		clearError(input, errorSpan);
		return true;
	}
};

const validateCheckbox = (input: HTMLInputElement, errorSpan: HTMLSpanElement) => {
	if (!input.checked) {
		setError(input, errorSpan, "Debes aceptar para continuar.");
		return false;
	} else {
		clearError(input, errorSpan);
		return true;
	}
};

// Función para validar todo el formulario
const validateForm = (elements: FormElements): boolean => {
	const { nameInput, emailInput, consentCheckbox, nameError, emailError, consentError } = elements;

	const isNameValid =
		validateFieldRequired(nameInput, nameError) && validateFieldMinLength(nameInput, nameError, 2);
	const isEmailValid =
		validateFieldRequired(emailInput, emailError) && validateEmailFormat(emailInput, emailError);
	const isConsentValid = validateCheckbox(consentCheckbox, consentError);

	return isNameValid && isEmailValid && isConsentValid;
};

// Función para inicializar el formulario de newsletter
export function initNewsletter(): void {
	const elements = getFormElements();
	if (!elements) return;

	const {
		form,
		nameInput,
		emailInput,
		consentCheckbox,
		nameError,
		emailError,
		consentError,
		successMessage,
	} = elements;

	// Agregar eventos de validación en tiempo real
	nameInput.addEventListener("blur", () => {
		validateFieldRequired(nameInput, nameError);
		validateFieldMinLength(nameInput, nameError, 2);
	});

	emailInput.addEventListener("blur", () => {
		validateFieldRequired(emailInput, emailError);
		validateEmailFormat(emailInput, emailError);
	});

	consentCheckbox.addEventListener("change", () => {
		validateCheckbox(consentCheckbox, consentError);
	});

	// Manejar el envío del formulario
	form.addEventListener("submit", (event) => {
		event.preventDefault();

		if (validateForm(elements)) {
			form.style.display = "none";
			successMessage.removeAttribute("hidden");
			successMessage.focus();
		} else {
			const firstInvalidInput = form.querySelector<HTMLInputElement>("[aria-invalid='true']");
			firstInvalidInput?.focus();
		}
	});
}
