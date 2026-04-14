# Utiliser Nginx pour servir les fichiers statiques de React
FROM nginx:alpine
# Copier le build React vers le dossier public de Nginx
COPY build/ /usr/share/nginx/html
# Remplacer la config par défaut pour gérer React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80