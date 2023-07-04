FROM node:20.3-slim
WORKDIR /src
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci
COPY public/ public
COPY src/ src
COPY tsconfig.json tsconfig.json
RUN npm run build
