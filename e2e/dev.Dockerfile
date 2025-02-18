FROM node:23
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npx playwright install
RUN npx playwright install-deps
COPY . .
CMD ["bash", "foo.sh"]