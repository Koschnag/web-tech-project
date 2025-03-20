# Verwende ein leichtgewichtiges Nginx-Image
FROM nginx:alpine

# Kopiere die statischen Dateien in das Nginx-Verzeichnis
COPY . /usr/share/nginx/html

# Kopiere die Nginx-Konfigurationsdatei
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Exponiere den Port 80
EXPOSE 80

# Starte Nginx
CMD ["nginx", "-g", "daemon off;"]