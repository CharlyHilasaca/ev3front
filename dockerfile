# Usa una imagen base de Node.js
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# Usa una imagen más ligera para servir la aplicación
FROM node:18-alpine AS runner

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia las dependencias instaladas y el build generado
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]