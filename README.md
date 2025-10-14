# 🤖 Full-Stack AI Ticket Classifier (NestJS + Next.js + MySQL + Redis)

**IA Project: Sistema Full-Stack Asíncrono de Clasificación de Tickets**

**Descripción:** Plataforma web moderna y segura para la ingestión y clasificación asíncrona de tickets de soporte. Construido con arquitectura **Server-Side Rendering (SSR)** para optimización SEO y alto rendimiento en dispositivos limitados (laptops y celulares antiguos). El backend utiliza un patrón de **Worker/Queue** simulado para procesar tickets con lógica de IA, aplicando **Redis Caching** para consultas ultra-rápidas.

---

`Next.js`, `NestJS`, `TypeScript`, `MySQL`, `Redis`, `Full-Stack`, `SSR`, `AI-Simulation`, `CORS`, `Rate-Limiting`, `TypeORM`, `Pico.css`

#NestJS #NextJS #FullStack #TypeScript #RedisCache #AI #ServerSideRendering #SSR #RateLimiting #MySQL

---

## 🏗️ Arquitectura del Proyecto

Este proyecto sigue un enfoque *Full-Stack Monorepo* dividido en dos servicios principales:

1.  **Backend (El Chef - NestJS):**
    * **Función:** API RESTful para la gestión de tickets.
    * **Base de Datos:** MySQL (Persistencia de datos).
    * **Caché:** Redis (Para búsquedas rápidas en `/history`).
    * **Seguridad:** Implementación de CORS, Helmet y Rate Limiting.
    * **Procesamiento Asíncrono:** Usa un **Worker Service** que simula escuchar una cola (SQS) para clasificar los tickets con lógica de IA en segundo plano, sin bloquear la respuesta al cliente.

2.  **Frontend (El Mesero - Next.js):**
    * **Framework:** Next.js con App Router.
    * **Rendimiento:** Implementado con **Server-Side Rendering (SSR)** para mejorar la velocidad de carga y el **SEO**.
    * **Diseño:** UI/UX optimizado con **Pico.css** (ligero) e incluye **Dark Mode**.
    * **Experiencia de Usuario:** Uso de `fetch` y `useRouter` para paginación y búsqueda sin recarga de página.
    * **SEO:** Configuración avanzada de Meta Tags, OpenGraph y Twitter Cards.

---

## 🚀 Inicio Rápido (Cómo Ejecutar)

### Requisitos Previos

Asegúrate de tener instalados y corriendo:

1.  **Node.js** (versión 18+)
2.  **MySQL Server** (y una base de datos creada, ej: `ia_project_db`).
3.  **Redis Server** (corriendo en el puerto por defecto, 6379).

### 1. Backend (NestJS)

Instala dependencias e inicia el Chef.

```bash
# Navegar a la carpeta del backend
cd back

# Instalar dependencias
npm install

# Iniciar el servidor de NestJS (por defecto en http://localhost:3001)
npm run start:dev

2. Frontend (Next.js)
Instala dependencias e inicia el Mesero.

# Navegar a la carpeta del frontend
cd front

# Instalar dependencias
npm install

# Iniciar el servidor de Next.js (por defecto en http://localhost:3000 o 3002)
npm run dev

🔐 Seguridad Implementada
XSS y SQL Injection: Mitigados por defecto por React/Next.js y TypeORM.

Rate Limiting: Implementado en NestJS (main.ts) para prevenir ataques de fuerza bruta y DDoS.

CORS: Configuración de whitelist estricta para el origen del frontend.

ValidationPipe: Validación de esquemas (DTOs) en el backend para límites de caracteres y tipos de datos.

