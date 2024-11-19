FROM node:22 as build

WORKDIR /app

COPY . /app/

WORKDIR /app
RUN npm install
RUN npm run build

FROM node:22 as app

RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

RUN npm install -g pm2

WORKDIR /app

COPY --from=build /app/dist/web-screensaver/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./api /app/api

WORKDIR /app/api
RUN npm install

EXPOSE 80
EXPOSE 3000

CMD ["sh", "-c", "nginx && pm2 start index.js --no-daemon"]