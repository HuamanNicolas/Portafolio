# Portfolio Personal - Nicolas Huaman

Portfolio web desarrollado con React + Vite, con panel de administración integrado y Firebase como backend.

## 🚀 Características

- **Portfolio Responsivo**: Diseño adaptable a dispositivos móviles y desktop
- **Animaciones Suaves**: Transiciones y efectos visuales al hacer scroll
- **Panel CRUD**: Sistema de administración protegido con autenticación
- **Firebase Integration**: Base de datos en tiempo real y autenticación de usuarios
- **Diseño Moderno**: Interfaz oscura con acentos en color turquesa

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Cuenta de Firebase

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd Portfolio
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto copiando `.env.example`:
```bash
cp .env.example .env
```

Luego edita el archivo `.env` y añade tus credenciales de Firebase:
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

## 🔐 Configuración de Firebase

### Firestore Database

Crea las siguientes colecciones en Firestore:

- **experiencia**: Almacena las experiencias laborales
- **proyectos**: Almacena los proyectos
- **users**: Usuarios con acceso al panel de administración

### Reglas de Seguridad

Configura las siguientes reglas en Firestore Database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Authentication

1. Habilita el método de autenticación "Email/Password" en Firebase Console
2. Crea un usuario administrador con email y contraseña

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🗂️ Estructura del Proyecto

```
Portfolio/
├── src/
│   ├── assets/          # Imágenes y recursos estáticos
│   ├── components/      # Componentes React
│   │   ├── admin/       # Panel de administración
│   │   └── ...          # Componentes del portfolio
│   ├── firebase/        # Configuración de Firebase
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── public/              # Archivos públicos
├── .env.example         # Plantilla de variables de entorno
└── package.json         # Dependencias del proyecto
```

## 🎨 Rutas

- `/` - Portfolio público
- `/crud` - Panel de administración (requiere autenticación)

## 🛠️ Tecnologías Utilizadas

- React 18
- Vite
- Firebase (Firestore + Authentication)
- React Icons
- CSS3 con animaciones personalizadas

## 📝 Notas Importantes

- **NO subir el archivo `.env`** a repositorios públicos
- Las credenciales de Firebase son sensibles y deben mantenerse privadas
- El archivo `.env.example` sirve como plantilla sin datos reales

## 👤 Autor

Nicolas Huaman
- GitHub: [@HuamanNicolas](https://github.com/HuamanNicolas)
- Email: nicolas.h2010fr@gmail.com

## 📄 Licencia

Este proyecto es de uso personal.
