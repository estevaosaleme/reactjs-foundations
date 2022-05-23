FROM node:16.3.0-alpine
WORKDIR /usr/src/app
ENV API_ADDRESS=http://localhost:3333
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3330
CMD [ "npm", "run", "dev" ]