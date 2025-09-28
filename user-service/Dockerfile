FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy all POMs and source code
COPY pom.xml .
COPY user-service/pom.xml ./user-service/
COPY user-service/src ./user-service/src

# Install Maven and build the project
RUN apt-get update && apt-get install -y maven && \
    mvn clean install -DskipTests -pl user-service -am && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/user-service

EXPOSE 8081

CMD ["java", "-jar", "target/*.jar"]


