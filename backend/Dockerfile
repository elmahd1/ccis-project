# Utiliser une image Java légère
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copier le JAR dans le conteneur
COPY mon-app.jar app.jar
# Exposer le port de Spring Boot (par défaut 8080)
EXPOSE 8080
# Lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]