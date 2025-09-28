FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy all POMs and source code
COPY pom.xml .
COPY api-gateway/pom.xml ./api-gateway/
COPY api-gateway/src ./api-gateway/src

# Install Maven and build the project
RUN apt-get update && apt-get install -y maven && \
    mvn clean install -DskipTests -pl api-gateway -am && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/api-gateway

EXPOSE 8080

CMD ["java", "-jar", "target/*.jar"]


