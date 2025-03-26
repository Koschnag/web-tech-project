FROM nginx:alpine

# Copy only necessary files
COPY index.html /usr/share/nginx/html/
COPY app /usr/share/nginx/html/app
COPY app/styles/styles.css /usr/share/nginx/html/styles.css
COPY router.js /usr/share/nginx/html/
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]