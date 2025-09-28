FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy all POMs and source code
COPY pom.xml .
COPY transaction-service/pom.xml ./transaction-service/
COPY transaction-service/src ./transaction-service/src

# Install Maven and build the project
RUN apt-get update && apt-get install -y maven && \
    mvn clean install -DskipTests -pl transaction-service -am && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/transaction-service

EXPOSE 8083

CMD ["java", "-jar", "target/*.jar"]


