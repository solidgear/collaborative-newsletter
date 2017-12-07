FROM node:6
LABEL maintainer="Jesus Macias <jmacias@solidgear.es>"

# CREDITS
# https://github.com/smebberson/docker-alpine
# https://github.com/just-containers/base-alpine
# https://github.com/bytepark/alpine-nginx-php7

# s6 overlay
RUN apt-get update -y && apt-get install -y curl

RUN curl -L -s https://github.com/just-containers/s6-overlay/releases/download/v1.18.1.5/s6-overlay-amd64.tar.gz \
  | tar xvzf - -C / 

#Instal packages
RUN apt-get install -y nginx bash git ssh rsync pwgen netcat-openbsd python make gcc g++ libc6 musl nano

# Install node global packages
RUN npm install -g gulp pm2 @angular/cli  

# Configure nginx
ADD docker/config/nginx.conf /etc/nginx/nginx.conf
ADD docker/config/default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/log/nginx

#COPY COPY
ADD ./backend /opt/nodeapp/
ADD ./frontend /var/www/html/
 
# Clean packages cache
RUN rm -rf /var/cache/apk/*

# root filesystem (S6 config files)
ADD ./docker/rootfs /

EXPOSE 3500 80 

# S6 init script
ENTRYPOINT [ "/init" ]