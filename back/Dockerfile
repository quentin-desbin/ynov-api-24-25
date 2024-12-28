FROM node:22-slim as build-stage
WORKDIR /app
COPY package.json ./
RUN apt-get update
RUN apt-get install -y openssl
RUN npm install
COPY . .
RUN npx prisma generate

FROM build-stage
EXPOSE 3000
CMD ["npm", "start"]
