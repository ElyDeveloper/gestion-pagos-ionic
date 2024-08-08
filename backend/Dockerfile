FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"]
