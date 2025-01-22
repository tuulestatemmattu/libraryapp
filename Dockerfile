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

ARG PORT
ENV PORT=${PORT}
ENV NODE_ENV=production
ENV DATABASE_URL=postgres://TODO
RUN npm run build

COPY --from=frontend /app/dist ./dist/public
EXPOSE ${PORT}
CMD ["node", "dist/index.js"]
