FROM node:23 AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ENV VITE_API_BASE_URL=/api
RUN npm run build


FROM node:23 AS backend
WORKDIR /app
COPY backend/package*json ./
RUN npm install
COPY backend/ ./
ENV PORT=8080
ENV NODE_ENV=production
RUN npm run build


COPY --from=frontend /app/dist ./dist/src/public
EXPOSE 8080
CMD ["node", "dist/src/index.js"]
