FROM node:23

WORKDIR /app
ENV CI=true
COPY package*.json ./
COPY . .
RUN npm i pnpm -g
RUN npm i tsx -g
RUN pnpm i
CMD pnpm run dev