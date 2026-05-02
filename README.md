# MaderArte — Sitio Web de Mueblería

> Repositorio oficial para el desarrollo del sitio web corporativo y tienda en línea de **MaderArte**, una mueblería de alto nivel enfocada en diseño, calidad y experiencia de compra premium.

---

## Tabla de Contenidos

1. [Visión del Proyecto](#visión-del-proyecto)
2. [Identidad Visual y Branding](#identidad-visual-y-branding)
3. [Estructura del Sitio](#estructura-del-sitio)
4. [Funcionalidades Requeridas](#funcionalidades-requeridas)
5. [Requisitos Técnicos](#requisitos-técnicos)
6. [Base de Datos y Modelos](#base-de-datos-y-modelos)
7. [Integraciones Externas](#integraciones-externas)
8. [Diseño Responsivo y Accesibilidad](#diseño-responsivo-y-accesibilidad)
9. [Rendimiento y SEO](#rendimiento-y-seo)
10. [Panel de Administración](#panel-de-administración)
11. [Seguridad](#seguridad)
12. [Testing](#testing)
13. [Estructura del Repositorio](#estructura-del-repositorio)
14. [Convenciones de Código](#convenciones-de-código)
15. [Flujo de Trabajo Git](#flujo-de-trabajo-git)
16. [Variables de Entorno](#variables-de-entorno)
17. [Instalación y Ejecución Local](#instalación-y-ejecución-local)
18. [Roadmap de Desarrollo](#roadmap-de-desarrollo)
19. [Decisiones de Diseño Importantes](#decisiones-de-diseño-importantes)
20. [Changelog](#changelog)
21. [Prompt para Cursor](#prompt-para-cursor)

---

## Visión del Proyecto

El cliente requiere un sitio web que transmita **lujo accesible**, sofisticación y confianza. No es una tienda en línea genérica: es una **experiencia de compra curada**, donde el usuario siente que está en una galería de diseño antes que en un catálogo.

### Objetivos principales

- Mostrar el catálogo completo de muebles con filtros avanzados y fotos de alta calidad.
- Permitir al usuario **cotizar y comprar en línea** con proceso de checkout claro y seguro.
- Transmitir la **historia y valores de la marca** a través del diseño editorial.
- Generar **confianza** mediante reseñas, garantías visibles y datos de contacto prominentes.
- Posicionar la marca en buscadores locales (**SEO local** prioritario).

---

## Identidad Visual y Branding

> **CRITICO**: Todo el equipo de desarrollo debe respetar estrictamente la guía de estilo. No se aceptan desviaciones en paleta de colores, tipografía ni espaciado sin aprobación del cliente.

### Paleta de Colores

| Nombre        | Hex       | Uso principal                     |
|---------------|-----------|-----------------------------------|
| Madera Oscura | `#2C1A0E` | Fondos, headers, texto principal  |
| Crema Marfil  | `#F5EFE0` | Fondos claros, tarjetas           |
| Dorado Suave  | `#B8935A` | Acentos, botones primarios, hover |
| Gris Piedra   | `#8A8070` | Texto secundario, bordes          |
| Blanco Hueso  | `#FDFAF5` | Fondo general de la página        |

### Tipografía

- **Display / Títulos**: `Playfair Display` — elegante, editorial, serif con carácter.
- **Cuerpo / Párrafos**: `DM Sans` — legible, neutro, moderno.
- **Detalles / Precios / Etiquetas**: `Courier Prime` — contraste industrial sofisticado.

Las fuentes deben cargarse desde **Google Fonts** con `display=swap` para no bloquear el renderizado.

### Tono de Comunicación

- Sofisticado pero cercano. Nunca frío ni técnico en exceso.
- Textos cortos, directos y visuales. El producto habla por sí solo.
- Usar lenguaje en **español neutro** (sin regionalismos excluyentes).

---

## Estructura del Sitio

```
/ (Home)
├── /catalogo
│   ├── /catalogo/[categoria]         ← ej: /catalogo/salas, /catalogo/comedores
│   └── /catalogo/producto/[slug]     ← ficha de producto individual
├── /nosotros
├── /blog                             ← artículos de decoración e inspiración
│   └── /blog/[slug]
├── /contacto
├── /cotizar                          ← formulario de cotización sin compra directa
├── /tienda                           ← flujo completo de e-commerce
│   ├── /tienda/carrito
│   ├── /tienda/checkout
│   └── /tienda/confirmacion
├── /cuenta
│   ├── /cuenta/login
│   ├── /cuenta/registro
│   ├── /cuenta/mis-pedidos
│   └── /cuenta/perfil
└── /admin                            ← panel de administración (acceso restringido)
```

---

## Funcionalidades Requeridas

### 1. Catálogo de Productos

- [ ] Listado de productos con **paginación** (máx. 20 por página) y opción de carga infinita.
- [ ] **Filtros combinables**: categoría, material, color, rango de precio, disponibilidad.
- [ ] **Ordenamiento**: precio ascendente/descendente, más nuevos, más vendidos.
- [ ] Vista de **cuadrícula y lista** (toggle).
- [ ] Buscador interno con **autocompletado** (Algolia o búsqueda nativa con Postgres full-text).
- [ ] Etiquetas: `Nuevo`, `Oferta`, `Más Vendido`, `Personalizable`.

### 2. Ficha de Producto

- [ ] Galería de imágenes con zoom y modo lightbox.
- [ ] Selector de variantes (tela, madera, acabado) con cambio visual en tiempo real.
- [ ] Descripción completa + especificaciones técnicas (dimensiones, materiales, peso).
- [ ] Tabla de dimensiones descargable en PDF.
- [ ] Sección de **reseñas y calificaciones** (estrellas + comentario).
- [ ] Botones de `Agregar al Carrito` y `Cotizar este producto`.
- [ ] Sección `También te puede interesar` (productos relacionados por categoría).
- [ ] Indicador de stock: Disponible / Últimas unidades / Bajo pedido.

### 3. Carrito y Checkout

- [ ] Carrito accesible desde cualquier página (panel lateral deslizante, no redirección).
- [ ] Actualización de cantidades y eliminación de productos en tiempo real.
- [ ] Resumen de pedido con subtotal, descuentos, envío e IVA desglosados.
- [ ] Paso 1: Datos de contacto y envío.
- [ ] Paso 2: Método de pago.
- [ ] Paso 3: Confirmación y resumen antes de pagar.
- [ ] Email de confirmación automático al completar el pedido.
- [ ] Página de confirmación con número de pedido y próximos pasos.

### 4. Sistema de Cotización

- [ ] Formulario independiente para solicitar cotización sin compra directa.
- [ ] El usuario puede adjuntar referencia visual (imagen).
- [ ] El administrador recibe la cotización por email y desde el panel.
- [ ] Respuesta automatizada al usuario confirmando recepción.

### 5. Autenticación de Usuarios

- [ ] Registro con email y contraseña.
- [ ] Login con Google (OAuth 2.0).
- [ ] Recuperación de contraseña por email.
- [ ] Historial de pedidos y cotizaciones por usuario autenticado.
- [ ] Dirección de envío guardada en el perfil.

### 6. Blog / Inspiración

- [ ] Artículos con categorías: Decoración, Tendencias, Guías de Compra, Cuidado de Muebles.
- [ ] Imágenes de portada, tiempo de lectura estimado y autor.
- [ ] Artículos relacionados al pie de cada post.
- [ ] Compartir en redes sociales (botones nativos, sin SDKs pesados).

### 7. Página de Inicio

- [ ] Hero section con video de fondo o imagen de alta resolución (lazy load).
- [ ] Sección de categorías destacadas con imagen y hover animado.
- [ ] Sección de productos más vendidos (carrusel).
- [ ] Sección de propuesta de valor (iconos: Envío, Garantía, Personalización, Asesoría).
- [ ] Testimonios de clientes (carrusel automático).
- [ ] Banner de promoción o novedad (editable desde el admin).
- [ ] Sección de Instagram feed (últimas publicaciones — opcional, requiere token).

---

## Requisitos Técnicos

### Stack

| Capa             | Tecnología                                       |
|------------------|--------------------------------------------------|
| Frontend         | Next.js 14+ (App Router)                         |
| Estilos          | Tailwind CSS + variables CSS personalizadas      |
| Animaciones      | Framer Motion                                    |
| Backend / API    | Next.js API Routes                               |
| Base de Datos    | PostgreSQL con Prisma ORM                        |
| Autenticación    | NextAuth.js (Google + Email)                     |
| Almacenamiento   | Cloudinary (imágenes de productos)               |
| Pagos            | Stripe + MercadoPago                             |
| Búsqueda         | Algolia o búsqueda nativa con Postgres full-text |
| Estado global    | Zustand (carrito + UI)                           |
| Hosting          | Vercel (frontend) + Railway o Supabase (DB)      |
| CMS / Admin      | Payload CMS o panel custom                       |
| Errores          | Sentry                                           |

> Si se cambia alguna tecnología del stack, debe documentarse aquí el motivo y la alternativa elegida **antes** de implementar.

### Versiones mínimas

```
Node.js    >= 20.x
npm        >= 10.x
Next.js    >= 14.2
TypeScript >= 5.x
```

---

## Base de Datos y Modelos

### Modelos principales (Prisma / PostgreSQL)

```prisma
model Product {
  id             String    @id @default(cuid())
  slug           String    @unique
  name           String
  description    String
  price          Float
  comparePrice   Float?
  stock          Int       @default(0)
  isCustomizable Boolean   @default(false)
  category       Category  @relation(fields: [categoryId], references: [id])
  categoryId     String
  variants       Variant[]
  images         Image[]
  reviews        Review[]
  tags           Tag[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Variant {
  id            String   @id @default(cuid())
  product       Product  @relation(fields: [productId], references: [id])
  productId     String
  type          String   // "color" | "material" | "acabado"
  label         String
  value         String
  imageUrl      String?
  priceModifier Float    @default(0)
}

model Order {
  id              String      @id @default(cuid())
  user            User?       @relation(fields: [userId], references: [id])
  userId          String?
  status          OrderStatus @default(PENDING)
  items           OrderItem[]
  total           Float
  shippingAddress Json
  paymentMethod   String
  stripePaymentId String?
  createdAt       DateTime    @default(now())
}

enum OrderStatus {
  PENDING
  CONFIRMED
  IN_PRODUCTION
  SHIPPED
  DELIVERED
  CANCELLED
}
```

Los modelos completos (`User`, `Category`, `Review`, `Quote`, `BlogPost`) deben vivir en `/prisma/schema.prisma` y **nunca editarse directamente en producción** sin ejecutar una migración con `prisma migrate deploy`.

---

## Integraciones Externas

### Stripe

- Pagos con tarjeta de crédito/débito.
- Webhooks en `/api/webhooks/stripe` para actualizar el estado de la orden automáticamente.
- Opción de guardar método de pago para usuarios registrados.

### MercadoPago

- Alternativa de pago para México y LATAM.
- Usar **Checkout Pro** para reducir la superficie de integración.
- Presentar como segunda opción en el paso de pago del checkout.

### Cloudinary

- Todas las imágenes de productos se alojan en Cloudinary. Nunca en el servidor.
- Aplicar transformaciones automáticas: formato WebP, thumbnails, lazy loading.
- Usar el SDK oficial de Node.js para subidas desde el panel de administración.

### Google Analytics 4 + Meta Pixel

- Trackear eventos: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`.
- Implementar con condición para no romper builds sin claves: `if (process.env.NEXT_PUBLIC_GA_ID)`.
- Configurar conversiones en GA4 desde el primer día del proyecto.

### Resend (Email transaccional)

- Plantillas HTML responsivas para: confirmación de pedido, recuperación de contraseña y acuse de cotización.
- No usar texto plano. Las plantillas deben estar en `/lib/emails/`.

---

## Diseño Responsivo y Accesibilidad

### Breakpoints

```
sm:  640px   — Móviles grandes
md:  768px   — Tablets
lg:  1024px  — Laptops
xl:  1280px  — Escritorios
2xl: 1536px  — Pantallas grandes
```

### Reglas de Responsividad

- **Mobile-first**: el diseño base es para móvil; se escala hacia pantallas mayores.
- Navegación en móvil: drawer lateral, no hamburguesa con dropdown vertical.
- Galería de producto en móvil: carrusel swipeable.
- Carrito en móvil: ocupa pantalla completa al abrirse.
- El checkout en móvil muestra un paso a la vez, sin scroll lateral.

### Accesibilidad (WCAG 2.1 nivel AA)

- [ ] Todos los elementos interactivos accesibles por teclado (`Tab`, `Enter`, `Escape`).
- [ ] Imágenes con `alt` descriptivo; decorativas con `alt=""`.
- [ ] Contraste de texto mínimo 4.5:1 con el fondo.
- [ ] Roles ARIA en modales, paneles y diálogos.
- [ ] Anuncio de cambios dinámicos con `aria-live`.
- [ ] Focus visible en todos los elementos interactivos (no eliminar outline sin reemplazo).

---

## Rendimiento y SEO

### Métricas objetivo (Core Web Vitals)

| Métrica | Objetivo |
|---------|----------|
| LCP     | < 2.5s   |
| CLS     | < 0.1    |
| INP     | < 200ms  |
| TTI     | < 3.5s   |

### Estrategias de Rendimiento

- Imágenes: formato WebP obligatorio, usar `next/image` con el atributo `sizes` correcto.
- Fuentes: `font-display: swap`, preload de la fuente de display principal.
- Componentes pesados (lightbox, editor): `dynamic(() => import(...), { ssr: false })`.
- ISR para páginas de catálogo: `revalidate: 3600`.
- SSG para páginas estáticas: Home, Nosotros, Contacto.
- Nunca importar librerías pesadas en el bundle del cliente si solo se usan en el servidor.

### SEO

- Metadata dinámica con `generateMetadata()` en cada segmento de ruta.
- Open Graph y Twitter Cards configurados en todas las páginas.
- `sitemap.xml` generado automáticamente incluyendo productos y artículos de blog.
- `robots.txt`: indexar todo excepto `/admin` y `/cuenta`.
- Schema.org `Product` markup en fichas de producto (precio, disponibilidad, reseñas).
- URLs con slug amigable: `/catalogo/salas/sofa-esquinero-venecia`.

---

## Panel de Administración

Ruta: `/admin` — acceso exclusivo para roles `ADMIN` y `EDITOR`.

| Módulo        | Funciones principales                                         |
|---------------|---------------------------------------------------------------|
| Dashboard     | Ventas del día, pedidos pendientes, stock bajo, visitas       |
| Productos     | CRUD completo, subida de imágenes, gestión de variantes       |
| Categorías    | Crear, editar, reordenar, asignar imagen de portada           |
| Pedidos       | Listado, cambio de estado, vista de detalle, exportar CSV     |
| Cotizaciones  | Ver solicitudes, marcar como respondida, adjuntar respuesta   |
| Usuarios      | Listado, roles, bloquear cuenta                               |
| Blog          | Editor rich text, publicar / guardar borrador                 |
| Banners       | Gestión del banner promocional del Home                       |
| Configuración | Datos de la tienda, métodos de pago activos, textos legales   |

> No construir el panel desde cero. Evaluar **Payload CMS** o **AdminJS** según el tiempo disponible. Documentar la decisión aquí antes de iniciar.

---

## Seguridad

- [ ] Variables sensibles nunca en el repositorio — usar `.env.local` y los secretos del hosting.
- [ ] Validación de todos los inputs en el servidor con **Zod** en cada API route.
- [ ] Rate limiting en rutas de autenticación y formularios públicos.
- [ ] Headers de seguridad en `next.config.js`: `X-Frame-Options`, `Content-Security-Policy`, `X-Content-Type-Options`.
- [ ] Protección CSRF en formularios que mutan datos.
- [ ] Middleware de autenticación en `/admin/**` y `/cuenta/**`.
- [ ] Imágenes validadas antes de subir a Cloudinary (tipo MIME + tamaño máximo).
- [ ] Logs de error con **Sentry** en producción. Nunca exponer stacktraces al cliente.

---

## Testing

### Estrategia

El proyecto sigue la pirámide de testing: más pruebas unitarias, menos pruebas E2E.

| Nivel       | Herramienta     | Qué cubre                                             |
|-------------|-----------------|-------------------------------------------------------|
| Unitario    | Vitest          | Funciones puras: validaciones, helpers, formatters    |
| Componentes | Testing Library | Renderizado, interacciones, estados de UI             |
| Integración | Vitest + Prisma | API routes con base de datos de prueba                |
| E2E         | Playwright      | Flujos críticos: checkout, login, cotización          |

### Flujos E2E obligatorios

- [ ] Usuario navega catálogo, agrega producto al carrito y completa el checkout.
- [ ] Usuario se registra, inicia sesión y ve su historial de pedidos.
- [ ] Usuario envía formulario de cotización y recibe confirmación.
- [ ] Administrador crea un producto nuevo con variantes e imagen.

### Cobertura mínima esperada

- Funciones de `lib/` y `store/`: 80% mínimo.
- API routes de pedidos y autenticación: 70% mínimo.
- No se bloquea el merge por cobertura, pero se reporta en cada PR.

### Scripts

```bash
npm run test          # Vitest en modo watch
npm run test:ci       # Vitest una sola pasada (para CI)
npm run test:e2e      # Playwright
npm run test:coverage # Reporte de cobertura
```

---

## Estructura del Repositorio

```
/
├── app/                        # Next.js App Router
│   ├── (public)/               # Rutas públicas
│   │   ├── page.tsx            # Home
│   │   ├── catalogo/
│   │   ├── nosotros/
│   │   ├── blog/
│   │   └── contacto/
│   ├── (auth)/                 # Login, Registro
│   ├── cuenta/                 # Rutas protegidas del usuario
│   ├── admin/                  # Panel de administración
│   └── api/                    # API Routes
│       ├── products/
│       ├── orders/
│       ├── auth/
│       ├── quotes/
│       └── webhooks/
├── components/
│   ├── ui/                     # Componentes atómicos (Button, Input, Modal...)
│   ├── layout/                 # Header, Footer, CartDrawer
│   ├── catalog/                # ProductCard, ProductGrid, Filters
│   ├── product/                # Gallery, VariantSelector, ReviewList
│   ├── cart/                   # CartDrawer, CartItem, CartSummary
│   ├── checkout/               # CheckoutSteps, PaymentForm
│   └── home/                   # HeroSection, FeaturedCategories, Testimonials
├── lib/
│   ├── prisma.ts               # Cliente Prisma (singleton)
│   ├── stripe.ts               # Configuración Stripe
│   ├── cloudinary.ts           # Helper de subida de imágenes
│   ├── emails/                 # Plantillas de email con Resend
│   └── validations/            # Schemas Zod
├── hooks/                      # Custom React Hooks
├── store/                      # Estado global Zustand (carrito, UI)
├── types/                      # Tipos TypeScript compartidos
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
│   └── images/                 # Solo assets estáticos del sitio
├── styles/
│   └── globals.css
├── .env.example
├── .env.local                  # En .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Convenciones de Código

- **Lenguaje**: TypeScript estricto. `any` está prohibido salvo casos documentados con comentario.
- **Componentes**: Funcionales con `const`. Nombrados en `PascalCase`.
- **Archivos**: `kebab-case` para rutas y utilidades; `PascalCase` para componentes.
- **Imports**: Primero librerías externas, luego internos con alias `@/`.
- **Estilos**: Tailwind en el JSX. Sin CSS Modules salvo animaciones complejas.
- **Commits**: Seguir Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- **Comentarios**: Solo donde la lógica no es obvia. Sin comentarios redundantes.
- **Server vs Client Components**: Preferir Server Components. Usar `"use client"` solo para interactividad o hooks del navegador.
- **Exports**: Un componente por archivo. No usar `export default` anónimo.

---

## Flujo de Trabajo Git

```
main        ← producción (protegida, solo merge vía PR aprobado)
staging     ← pre-producción / QA
develop     ← desarrollo activo
feature/*   ← funcionalidades nuevas (ej: feature/carrito-lateral)
fix/*       ← correcciones (ej: fix/precio-variante)
```

- Nunca hacer push directo a `main` ni a `staging`.
- Cada PR requiere al menos **1 revisión aprobada** antes de merge.
- GitHub Actions ejecuta lint + build + tests en cada PR automáticamente.
- Los merges a `main` siempre pasan por `staging` primero.

---

## Variables de Entorno

Copiar `.env.example` a `.env.local` y completar todos los valores antes de iniciar el servidor.

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/muebleria

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# MercadoPago
MP_ACCESS_TOKEN=
MP_PUBLIC_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@maderarte.com

# Algolia (opcional)
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=

# Sentry
SENTRY_DSN=
```

---

## Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-org/maderarte.git
cd maderarte

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores correspondientes

# 4. Ejecutar migraciones de base de datos
npx prisma migrate dev

# 5. Poblar con datos de prueba (opcional)
npx prisma db seed

# 6. Iniciar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Roadmap de Desarrollo

El proyecto se divide en fases para entregar valor de forma incremental y detectar problemas antes de construir sobre ellos.

### Fase 1 — Base y Catálogo (semanas 1-3)

- [ ] Configuración del proyecto: Next.js, Tailwind, TypeScript, ESLint, Prisma.
- [ ] Modelos de base de datos y seed de productos de prueba.
- [ ] Layout principal: Header, Footer, navegación responsiva.
- [ ] Página de Home (estructura sin animaciones aún).
- [ ] Catálogo con listado, filtros básicos y paginación.
- [ ] Ficha de producto con galería y variantes.

### Fase 2 — Carrito, Checkout y Pagos (semanas 4-6)

- [ ] Carrito como drawer lateral con Zustand.
- [ ] Flujo de checkout en 3 pasos.
- [ ] Integración con Stripe.
- [ ] Integración con MercadoPago.
- [ ] Emails transaccionales con Resend.
- [ ] Página de confirmación de pedido.

### Fase 3 — Autenticación y Cuentas (semana 7)

- [ ] Registro y login (email + Google).
- [ ] Rutas protegidas con middleware NextAuth.
- [ ] Historial de pedidos en `/cuenta/mis-pedidos`.
- [ ] Perfil de usuario con dirección guardada.

### Fase 4 — Cotización y Blog (semana 8)

- [ ] Formulario de cotización con subida de imagen.
- [ ] Módulo de blog con editor y categorías.
- [ ] Reseñas de productos.

### Fase 5 — Panel de Administración (semanas 9-10)

- [ ] Dashboard con métricas clave.
- [ ] CRUD de productos, categorías y variantes.
- [ ] Gestión de pedidos y cotizaciones.
- [ ] Gestión de blog y banners.

### Fase 6 — Pulido, Rendimiento y Lanzamiento (semanas 11-12)

- [ ] Animaciones con Framer Motion.
- [ ] Optimización de Core Web Vitals.
- [ ] Configuración de Sentry, GA4 y Meta Pixel.
- [ ] SEO técnico: sitemap, schema.org, metadata completa.
- [ ] Tests E2E de flujos críticos con Playwright.
- [ ] Deploy a producción en Vercel + Railway.

---

## Decisiones de Diseño Importantes

> Esta sección existe para evitar debates repetidos. Las decisiones registradas aquí no se revierten sin acuerdo explícito del cliente.

| Decisión | Motivo |
|---|---|
| Next.js App Router | ISR nativo, layouts anidados, Server Components reducen el JS enviado al cliente |
| Zustand para carrito | Persistencia en localStorage sin re-renders innecesarios en toda la app |
| Cloudinary para imágenes | Transformaciones automáticas y CDN sin configuración adicional de infraestructura |
| Slug en URL (no ID numérico) | SEO friendly, URLs legibles, desacopla la base de datos del frontend |
| Carrito como drawer lateral | Reduce fricción: el usuario no pierde el contexto de navegación al agregar productos |
| ISR con revalidate 1h en catálogo | Balance entre frescura de datos y rendimiento; evita SSR puro en páginas de alto tráfico |
| Stripe + MercadoPago | Cobertura internacional + LATAM; no depender de un solo proveedor de pagos |
| Resend para emails | API moderna, plantillas React, mejor deliverability que Nodemailer directo |
| Vitest sobre Jest | Más rápido en proyectos Next.js, compatible con ESM sin configuración adicional |

---

## Changelog

Registrar aquí cada cambio arquitectónico o de decisión relevante con fecha y autor.

```
[SIN ENTRADAS AUN]
```

Formato sugerido para cada entrada:

```
## [FECHA] — [AUTOR]
### Qué cambió
Descripción breve del cambio.
### Por qué
Motivo de la decisión.
### Impacto
Qué partes del proyecto se ven afectadas.
```

---
