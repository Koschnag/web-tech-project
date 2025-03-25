FROM nginx:alpine

# Copy only necessary files
COPY index.html /usr/share/nginx/html/
COPY registrierung.html /usr/share/nginx/html/
COPY boersenspiel.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY boerse.js /usr/share/nginx/html/
COPY registrierung.js /usr/share/nginx/html/
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]