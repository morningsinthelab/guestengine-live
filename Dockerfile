FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/guest-canonical.map /etc/nginx/guest-canonical.map
COPY . /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
