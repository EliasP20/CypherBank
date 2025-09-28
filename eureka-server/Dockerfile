FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy service POM and source code
COPY eureka-server/pom.xml .
COPY eureka-server/src ./src

# Install Maven and build the project
RUN apt-get update && apt-get install -y maven && \
    mvn clean package -DskipTests && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/eureka-server

EXPOSE 8761

CMD ["java", "-jar", "target/*.jar"]


