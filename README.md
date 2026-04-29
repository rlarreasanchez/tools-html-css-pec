![Preview](responsive-devices-mockup.png)

# Sitio Web de Recetas Tradicionales

Proyecto académico de implementación de un sitio web de recetas utilizando herramientas modernas de desarrollo web como: Parcel, TypeScript, Sass, PostHTML.

## Descripción

Sitio web de recetas con generación automática de páginas con los detalles de cada receta. Utiliza un sistema de plantillas HTML modular (PostHTML) junto con preprocesamiento de estilos (Sass) y tipado estricto con TypeScript, todo empaquetado y optimizado mediante Parcel 2.

## Características Principales

- **Generación automática de páginas** de detalle de recetas
- **Sistema de plantillas modular** con PostHTML (con los plugins `extend`, `include`, `expressions`)
- **Estilos con Sass** y arquitectura de componentes
- **TypeScript** para código JavaScript tipado y robusto
- **Hot Module Replacement (HMR)** en modo desarrollo gracias a Parcel
- **Optimización automática** en producción (minificación, tree-shaking) gracias a Parcel
- **Diseño responsive** adaptado a múltiples dispositivos

## Tratamiento de Imágenes y Recursos Visuales

### Imágenes Responsive

El proyecto implementa **tres técnicas de imágenes responsive** según el tipo de imagen y su función en la interfaz:

#### 1. Resolution Switching por Tamaño

Utilizado en las **tarjetas de recetas** mediante `srcset` con descriptores de ancho (`300w`, `400w`, `600w`, `800w`) y el atributo `sizes`. El navegador selecciona automáticamente la imagen más adecuada según el espacio disponible en el viewport. Beneficio principal: dispositivos móviles descargan versiones más ligeras, reduciendo el tiempo de carga y el consumo de datos.

#### 2. Resolution Switching por Densidad de Píxeles

Aplicado en **imágenes de contenido de recetas, sección About y sello del footer** mediante variantes `1x` y `2x`. Pantallas de alta densidad (Retina, HiDPI) descargan la versión `2x` para mantener la nitidez, mientras que pantallas estándar usan la versión `1x`. El tamaño visual no cambia, solo la calidad según la capacidad del dispositivo.

#### 3. Dirección de Arte

Implementado en **imagen hero y cabeceras de recetas** mediante el elemento `<picture>` con diferentes recortes y proporciones por breakpoint. Por ejemplo, el hero usa un recorte cuadrado en móvil (640×640), formato horizontal en tablet (1024×640) y panorámico en desktop (1600×900). Esto preserva el foco visual y la composición en todos los dispositivos.

### Optimización de Imágenes

Todas las imágenes se optimizan automáticamente a **WebP** mediante **Sharp** integrado con Parcel durante el build, logrando una reducción superior al **60%** del peso total sin pérdida perceptible de calidad. Se mantiene fallback a formatos originales (JPG/PNG) para navegadores sin soporte WebP. La configuración de calidad y compresión se define en `sharp.config.json`.

### Animaciones y Transiciones CSS

Las animaciones se clasifican en tres grupos: **microinteracciones** (hover/focus en tarjetas y botones), **animaciones de entrada** (aparición progresiva de contenido filtrado) y **animaciones expresivas** (entrada de elementos decorativos del hero). Se utiliza la librería **AOS (Animate On Scroll)** para animar bloques al hacer scroll de forma controlada, con duración de 800ms y ejecución única (`once: true`).

### SVG Decorativo

El hero incluye un **SVG inline animado** con elementos de cubiertos que aparecen de forma escalonada mediante `@keyframes`. El SVG está marcado con `aria-hidden="true"` para que los lectores de pantalla lo ignoren, ya que cumple una función puramente decorativa.

### Uso de clip-path

En la sección "Sobre nosotros" se utiliza **clip-path** con una forma poligonal personalizada para recortar la imagen con un encuadre orgánico. La misma forma se aplica a pseudo-elementos desplazados que generan capas de color, creando un efecto de profundidad sin comprometer la accesibilidad del contenido.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior recomendada)
- **npm** (incluido con Node.js)

## Instalación

1. **Clona el repositorio** o descarga el código fuente:

```bash
git clone https://github.com/rlarreasanchez/tools-html-css-pec.git
```

2. **Instala las dependencias** del proyecto:

```bash
cd tools-html-css-pec
npm install
```

Este comando instalará todas las dependencias especificadas en el archivo `package.json`, incluyendo Parcel, TypeScript, Sass, PostHTML y sus plugins, etc...

## Entorno de Desarrollo

Para iniciar el entorno de desarrollo hay que ejecutar el siguiente comando:

```bash
npm start
```

Este comando ejecuta la siguiente secuencia:

1. **Limpia** directorios anteriores (`dist` y `.parcel-cache`)
2. **Genera las páginas de recetas** automáticamente desde los archivos JSON
3. **Inicia el servidor de desarrollo** con el bundler Parcel

El servidor estará disponible en: **http://localhost:1234**

### Archivos importantes

- **HTML**: Archivos en `src/pages/`, `src/layouts/` y `src/partials/`
- **Estilos**: Archivos `.scss` en `src/styles/`
- **Scripts**: Archivos `.ts` en `src/ts/`
- **Recetas**: Archivos `.json` en `src/data/recipes/`
- **Imágenes**: Archivos en `src/images/`

> **Nota**: Si modificas archivos JSON de recetas, deberás **reiniciar el servidor** de desarrollo para regenerar las páginas HTML correspondientes.

## Entorno de Producción

Para generar una versión optimizada del sitio web lista para producción:

```bash
npm run build
```

Este comando:

1. **Limpia** directorios anteriores
2. **Genera las páginas de recetas**
3. **Compila y optimiza** todos los archivos

### Resultado

Los archivos optimizados se generan en la carpeta **`dist/`**, que contiene:

- Páginas HTML minificadas
- CSS compilado y minificado
- JavaScript transpilado y minificado
- Imágenes optimizadas
- Archivos estáticos con nombres hasheados

Puedes desplegar el contenido de la carpeta `dist/` en cualquier servidor web estático

Puedes ver el resultado en la página web:
[https://tools-html-css-pec.netlify.app/](https://tools-html-css-pec.netlify.app/)

## Sistema de Generación Automática de Páginas

### Cómo Funciona

El proyecto utiliza un **script de generación automática** (`src/scripts/generate-recipes-pages.cjs`) que:

1. **Escanea** la carpeta `src/data/recipes/` en busca de archivos JSON (excluyendo `template.json` que es la plantilla para nuevas recetas)
2. **Lee** cada archivo de receta y extrae sus datos
3. **Elimina** cualquier página de recetas existentes en `src/pages/` con el prefijo definido en `recipes.config.json` (para evitar páginas huérfanas)
4. **Genera** una página HTML para cada receta en `src/pages/` con el formato `{RECIPES_SLUG}1.html`, `{RECIPES_SLUG}2.html`, etc.
5. **Crea** el contenido HTML utilizando el layout `site-page-layout.html` y el partial `recipe-detail.html`

> **Nota**: No es necesario ejecutar este script manualmente, ya que se ejecuta automáticamente al iniciar el servidor de desarrollo o al generar el build de producción.

> **Nota**: Si añades nuevas páginas en `src/pages/`, asegúrate de no nombrarlas con el prefijo definido en `recipes.config.json` para evitar conflictos con el sistema de generación automática

> **Nota**: Si modificas el prefijo y ya se han generado páginas con el prefijo anterior, deberás eliminar manualmente las páginas antiguas para evitar páginas huérfanas. El sistema de generación solo elimina páginas que coincidan con el prefijo actual definido en `recipes.config.json`.

### Flujo de Generación

```
src/data/recipes/recipe-1.json  →  src/pages/{RECIPES_SLUG}1.html
src/data/recipes/recipe-2.json  →  src/pages/{RECIPES_SLUG}2.html
src/data/recipes/recipe-3.json  →  src/pages/{RECIPES_SLUG}3.html
...
```

### Configuración

El sistema utiliza dos archivos de configuración:

#### `src/config/recipes.config.json`

```json
{
	"RECIPES_SLUG": "det" // Para cumplir con las especificaciones del ejercicio propuesto para la PEC
}
```

Define el prefijo del slug para las URLs de las recetas (ej: `/det1`, `/det2`).

#### `src/config/pagination.config.json`

```json
{
	"RECIPES_PER_PAGE": 6
}
```

Define cuántas recetas se muestran por página en el listado principal (url: `/categoria`).

### Páginas Generadas

Cada página generada:

- Extiende el layout principal del sitio
- Incluye metadatos SEO (título y descripción de la receta)
- Renderiza el contenido de la receta usando el partial `recipe-detail.html`
- Se vincula automáticamente desde las tarjetas de recetas en los listados de recetas

## Cómo Crear Nuevas Recetas

### Paso 1: Crear el Archivo JSON

1. **Navega** a la carpeta `src/data/recipes/`
2. **Duplica** el archivo `template.json` o cualquier receta existente
3. **Renombra** el archivo siguiendo el patrón: `recipe-N.json` (donde N es el siguiente número disponible)

### Paso 2: Completar los Datos de la Receta

Abre el archivo JSON y completa todos los campos:

```json
{
	"title": "Título de la receta",
	"title_html": "Título con etiquetas <span>HTML</span>",
	"description": "Descripción breve para SEO",
	"description_html": "Descripción con etiquetas <span>HTML</span> para el listado",
	"link_aria_label": "Leer receta completa de [Nombre de la receta]",
	"image": "nombre-imagen.jpg",
	"alt_image": "Descripción detallada de la imagen",
	"category": "Pasta | Postres | Arroces | etc.",
	"duration": "45 minutos",
	"difficulty": "Fácil | Media | Difícil",
	"rations": "4",
	"contents": [
		{
			"type": "paragraph",
			"text": "Texto del párrafo con HTML permitido"
		},
		{
			"type": "image",
			"src": "nombre-imagen-contenido.jpg",
			"alt": "Descripción de la imagen",
			"caption": "Pie de foto"
		},
		{
			"type": "video",
			"src": "https://www.youtube.com/embed/VIDEO_ID",
			"title": "Título del video",
			"caption": "Descripción del video"
		}
	],
	"attributions": [
		{
			"image": "Nombre identificativo de la imagen",
			"author_name": "Nombre del autor",
			"author_url": "https://enlace-al-perfil-del-autor.com",
			"source_name": "Nombre de la fuente",
			"source_url": "https://enlace-a-la-fuente.com"
		}
	]
}
```

> **Nota**: En la clave `contents`, se incluirán los elementos que serán visualizados en la página de detalle de la receta `/{RECIPES_SLUG}{N}`, puedes añadir múltiples elementos de tipo párrafo, imagen o video para enriquecer la receta. Asegúrate de seguir el formato correcto para cada tipo de contenido. Las secciones aparecerán en el orden definido en el array.

> **Nota**: En la clave `attributions`, puedes incluir créditos para las imágenes utilizadas en la receta. Estas atribuciones se mostrarán en la página de enlaces `/links.html`, en la tabla de atribuciones de imágenes.

### Paso 3: Añadir las Imágenes

1. **Guarda las imágenes** en la carpeta `src/images/`
2. **Nomenclatura recomendada**:
   - Imagen principal: `recipe-N.jpg`
   - Imágenes de contenido: `recipe-N-content-1.jpg`, `recipe-N-content-2.jpg`, etc.

### Paso 4: Regenerar las Páginas

Para que la nueva receta aparezca en el sitio:

```bash
npm run generate:recipes
```

O simplemente reinicia el servidor de desarrollo:

```bash
npm start
```

### Paso 5: Verificar

1. Abre el navegador en `http://localhost:1234`
2. Verifica que la nueva receta aparece en el listado principal
3. Haz click en la tarjeta para ver la página de detalle
4. Comprueba que todos los datos se muestran correctamente en su orden y formato
5. Verifica que las atribuciones de las imágenes aparecen en la página de enlaces

### Campos del JSON Explicados

| Campo              | Descripción                                               |
| ------------------ | --------------------------------------------------------- |
| `title`            | Título de la receta (texto plano)                         |
| `title_html`       | Título con formato HTML (permite etiquetas como `<span>`) |
| `description`      | Resumen breve para SEO y listado                          |
| `description_html` | Resumen con formato HTML                                  |
| `link_aria_label`  | Texto descriptivo para accesibilidad                      |
| `image`            | Nombre del archivo de imagen principal                    |
| `alt_image`        | Texto alternativo descriptivo de la imagen                |
| `category`         | Categoría de la receta                                    |
| `duration`         | Tiempo de preparación                                     |
| `difficulty`       | Nivel de dificultad                                       |
| `rations`          | Número de raciones                                        |
| `contents`         | Array con el contenido detallado                          |
| `attributions`     | Array con créditos de las imágenes utilizadas             |

### Tipos de Contenido Soportados

El array `contents` puede incluir tres tipos de elementos:

#### 1. Párrafo

```json
{
	"type": "paragraph",
	"text": "Texto del párrafo con <span lang=\"it\">HTML permitido</span>"
}
```

#### 2. Imagen

```json
{
	"type": "image",
	"src": "nombre-imagen.jpg",
	"alt": "Descripción accesible",
	"caption": "Pie de foto opcional"
}
```

#### 3. Video

```json
{
	"type": "video",
	"src": "https://www.youtube.com/embed/VIDEO_ID",
	"title": "Título para accesibilidad",
	"caption": "Descripción del video"
}
```

### Atribuciones de Imágenes

En la sección `attributions`, puedes incluir créditos para las imágenes utilizadas en la receta. Cada objeto de atribución debe contener:

- `image`: Nombre identificativo de la imagen de la receta
- `author_name`: Nombre del autor de la imagen
- `author_url`: URL al perfil del autor
- `source_name`: Nombre de la fuente original de la imagen
- `source_url`: URL a la fuente original de la imagen

## Estructura del Proyecto

```
tools-html-css-pec/
├── dist/                      # Build de producción (generada)
├── .parcel-cache/             # Cache de Parcel (generada)
├── node_modules/              # Dependencias de módulos de Node (generada)
├── src/
│   ├── config/                 # Archivos de configuración
│   │   ├── pagination.config.json
│   │   └── recipes.config.json
│   ├── data/
│   │   └── recipes/            # Datos de recetas en formato JSON
│   │       ├── recipe-1.json
│   │       ├── recipe-2.json
│   │       ├── ...
│   │       └── template.json   # Plantilla para nuevas recetas
│   ├── images/                 # Imágenes del sitio
│   ├── layouts/                # Layouts principales
│   │   └── site-page-layout.html
│   ├── pages/                  # Páginas HTML
│   │   ├── index.html
│   │   ├── categoria.html
│   │   ├── links.html
│   │   ├── det1.html           # ← Generada automáticamente
│   │   ├── det2.html           # ← Generada automáticamente
│   │   └── ...
│   ├── partials/               # Componentes y secciones reutilizables
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── ...
│   ├── scripts/                # Scripts de generación
│   │   └── generate-recipes-pages.cjs
│   ├── styles/                 # Estilos Sass
│   │   ├── styles.scss         # Archivo principal de estilos
│   │   ├── _variables.scss
│   │   ├── _typography.scss
│   │   └── ...
│   └── ts/                     # Código TypeScript
│       ├── main.ts						  # Archivo principal de TypeScript
│       ├── navigation.ts
│       └── ...
├── .gitignore								 # Archivos y carpetas a ignorar por Git
├── .postcssrc								 # Configuración de PostCSS
├── .posthtmlrc.cjs						 # Configuración de PostHTML
├── LICENSE						 				 # Licencia del proyecto
├── package-lock.json          # Archivo de bloqueo de dependencias (generado)
├── package.json				 			 # Archivo de configuración de npm y dependencias
├── tsconfig.json              # Configuración de TypeScript
└── README.md
```

## Scripts Disponibles

| Comando                    | Descripción                                  |
| -------------------------- | -------------------------------------------- |
| `npm start`                | Inicia el servidor de desarrollo             |
| `npm run build`            | Genera el build de producción                |
| `npm run generate:recipes` | Genera las páginas de recetas                |
| `npm run clean`            | Limpia las carpetas `dist` y `.parcel-cache` |
| `npm run parcel:dev`       | Solo inicia Parcel en modo desarrollo        |
| `npm run parcel:build`     | Solo construye con Parcel (producción)       |

## Tecnologías Utilizadas

### Empaquetador

- **Parcel 2.16+** - Empaquetador zero-config con HMR

### Preprocesadores y Transformadores

- **TypeScript 5.9+** - JavaScript tipado
- **Sass (SCSS)** - Preprocesador CSS
- **PostHTML** - Transformador HTML con plugins:
  - `posthtml-extend` - Sistema de layouts
  - `posthtml-include` - Inclusión de partials
  - `posthtml-expressions` - Expresiones y lógica en templates
- **PostCSS** - Postprocesador CSS con `postcss-normalize`

### Utilidades

- **Fast-glob** - Búsqueda rápida de archivos
- **npm-run-all** - Ejecución secuencial de scripts
- **rimraf** - Limpieza de directorios multiplataforma

### UI

- **Font Awesome 7+** - Iconos vectoriales en toda la web
  ([fontawesome.com](https://fontawesome.com/))
- **Swiper 12+** - Carrusel de tarjetas de recetas ([swiperjs.com](https://swiperjs.com/))
- **AOS (Animate On Scroll) 3+** - Animaciones al hacer scroll ([michalsnik.github.io/aos](https://michalsnik.github.io/aos/))

## Autor

[Rafael Larrea Sánchez](https://www.linkedin.com/in/rafael-larrea-s%C3%A1nchez-06824592/)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulte el archivo [LICENSE](LICENSE) para obtener más información.

---

Desarrollado como proyecto académico para el **Máster Universitario en Desarrollo de Sitios Web** - Asignatura: Herramientas HTML y CSS
