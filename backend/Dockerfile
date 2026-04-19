# ==========================================
# STAGE 1: Build the Spring Boot Application
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Compile the code and package the .jar (skips tests to speed up the build)
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Run the Application
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the generated .jar from the "builder" stage 
COPY --from=builder /app/target/SFE-0.0.1-SNAPSHOT.jar app.jar

# Expose the port 
EXPOSE 8080

# Run the application 
ENTRYPOINT ["java", "-jar", "app.jar"]