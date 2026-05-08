# api-my-training

API REST para la aplicación **My Training** — gestión de rutinas de entrenamiento, dieta, cardio y usuarios. Construida con **NestJS** + **MongoDB Atlas**.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v20 o superior
- [pnpm](https://pnpm.io/) (gestor de paquetes)
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) con un cluster creado

Instalar pnpm si no lo tienes:
```bash
npm install -g pnpm
```

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd api-my-training

# Instalar dependencias
pnpm install
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (cópialo de `.env.example`):

```bash
cp .env.example .env
```

Rellena los valores en `.env`:

```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/my-training
JWT_SECRET=tu_clave_secreta_muy_larga
FRONTEND_URL=http://localhost:4200
PORT=3000
```

> ⚠️ **Nunca subas el `.env` a GitHub.** Está en `.gitignore`.

---

## Arrancar en local

```bash
# Modo desarrollo (con hot-reload)
pnpm run start:dev

# La API estará disponible en:
# http://localhost:3000/my-training/v1
```

---

## Otros comandos

```bash
# Compilar para producción
pnpm run build

# Arrancar en producción (requiere build previo)
pnpm run start:prod

# Linter
pnpm run lint

# Tests
pnpm run test
```

---

## Despliegue en Railway

1. Sube el repositorio a GitHub
2. En [Railway](https://railway.app/) → **New Project** → **Deploy from GitHub repo**
3. Selecciona este repositorio
4. En **Variables** añade:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (URL de Vercel cuando la tengas)
5. Railway detecta automáticamente NestJS y ejecuta `pnpm run build` + `pnpm run start:prod`

---

## Despliegue con Docker

```bash
# Construir la imagen
docker build -t api-my-training .

# Ejecutar el contenedor
docker run -p 3000:3000 \
  -e MONGODB_URI="tu_connection_string" \
  -e JWT_SECRET="tu_clave_secreta" \
  -e FRONTEND_URL="http://localhost:4200" \
  api-my-training
```

O con Docker Compose:

```bash
docker compose up --build
```

---

## Estructura del proyecto

```
src/
├── auth/           # Módulo de autenticación (JWT + Passport)
├── users/          # Gestión de usuarios y perfiles
├── routines/       # Rutinas de entrenamiento
├── exercises/      # Biblioteca de ejercicios
├── diets/          # Dietas y alimentos
├── foods/          # Catálogo de alimentos
├── cardio/         # Configuraciones de cardio
└── common/         # Interceptores, pipes y utilidades compartidas
```

---

## Tecnologías

- [NestJS](https://nestjs.com/) v11
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Passport JWT](https://www.passportjs.org/) — autenticación
- [class-validator](https://github.com/typestack/class-validator) — validación de DTOs
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — hash de contraseñas
