# Venezuela Cargo - App Móvil

Aplicación móvil Android desarrollada con Quasar Framework (Vue 2 + Cordova)

## Documentación

- [Arquitectura del Sistema](../docs/ARQUITECTURA.md)
- [API Reference](../docs/API.md)

## Requisitos

- Node.js >= 10.18.1
- NPM >= 6.13.4
- JDK 17
- Gradle 7.6.4
- Android SDK 33
- Cordova

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build Android

```bash
# Debug
npm run cordova:debug

# Producción
npm run cordova:prod
```

## Estructura

```
src/
├── pages/          # Vistas de la app
├── components/     # Componentes reutilizables
├── layouts/        # Layouts principales
├── store/          # Estado (Vuex)
└── router/         # Rutas
```
