FROM node:22-alpine as build-stage
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM nginx:stable
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY ./nginx-configuration.conf /etc/nginx/conf.d/default.conf
