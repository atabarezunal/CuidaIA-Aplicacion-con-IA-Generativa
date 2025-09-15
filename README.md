# CuidaIA-Aplicacion-con-IA-Generativa
CuidaIA es una aplicación web/móvil impulsada por Inteligencia Artificial Generativa, diseñada para mejorar la vida de los adultos mayores mediante recordatorios médicos, asistencia en tareas diarias, compañía conversacional y monitoreo de bienestar, con una interfaz accesible y fácil de usar.

**CuidaIA** es una aplicación web desarrollada con **Next.js** y **TypeScript**, diseñada para mejorar la calidad de vida de los **adultos mayores** mediante el uso de **Inteligencia Artificial Generativa (IA Gen)**. La aplicación ofrece asistencia personalizada, recordatorios médicos, interacción conversacional y herramientas que promueven la autonomía, seguridad y bienestar.

---

## ✨ Funcionalidades principales

* 🗓️ **Recordatorios médicos y de actividades**: gestión de medicamentos, citas y tareas diarias.
* 💬 **Asistente conversacional con IA**: compañía y apoyo emocional mediante chat inteligente.
* 👤 **Perfil médico personalizado**: almacenamiento de información relevante de salud.
* 📊 **Panel de control**: vista centralizada del estado, actividades y recomendaciones.
* 🎨 **Interfaz accesible y amigable**: botones claros, texto grande y navegación simple.

---

## 🛠️ Tecnologías utilizadas

* **Framework:** [Next.js 13+ (App Router)](https://nextjs.org/)
* **Lenguaje:** TypeScript
* **Estilos:** TailwindCSS + shadcn/ui
* **IA Generativa:** Integración con servicios externos (ej. OpenAI API)
* **Estado y lógica:** React Hooks + Context API
* **Analítica:** Vercel Web Analytics
* **Gestión de paquetes:** pnpm

---

## 🚀 Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/cuidaia-app.git
cd cuidaia-app
```

### 2. Instalar dependencias

```bash
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales:

```env
GROQ_API_KEY=api_key
JWT_SECRET=mi_clave_super_secreta_y_larga_123456789
```

### 4. Ejecutar en modo desarrollo

```bash
yarn dev
```

La aplicación estará disponible en: [http://localhost:3000](http://localhost:3000)


## 📂 Estructura principal del proyecto

```
cuidaia-app/
├── app/
│   ├── login/
│   ├── register/
│   ├── medical-profile/
│   ├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ai-chat-service.tsx
│   └── ui/* (componentes de interfaz reutilizables)
├── public/
├── styles/
├── package.json
└── tsconfig.json
```

---

## 🎯 Objetivo del proyecto

Brindar a los adultos mayores un asistente digital que facilite su día a día con **tecnología accesible y empática**, mejorando su autonomía, seguridad y bienestar integral.

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para colaborar:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Envía un pull request.

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más información.


# AI app for seniors

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/atabarez-1080s-projects/v0-ai-app-for-seniors)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/NNxY0F4qGBu)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
