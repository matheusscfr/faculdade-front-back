# syntax=docker/dockerfile:1
# ---------- build ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
# cache do ~/.m2 entre builds: dependências baixadas só uma vez
RUN --mount=type=cache,target=/root/.m2 mvn -q -B package -DskipTests

# ---------- runtime ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN mkdir -p /app/logs
COPY --from=build /build/target/*.jar app.jar
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
