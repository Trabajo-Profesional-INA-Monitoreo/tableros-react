FROM node:16.17.1-alpine3.16 as build
WORKDIR /usr/app
COPY . /usr/app

RUN npm install
RUN npm run build
RUN npm install -g serve

FROM nginx:1.23.1-alpine
EXPOSE 3000
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/build /usr/share/nginx/html/monitoreo
COPY ./docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh 
