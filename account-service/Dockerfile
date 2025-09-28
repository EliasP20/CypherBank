FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy all POMs and source code
COPY pom.xml .
COPY account-service/pom.xml ./account-service/
COPY account-service/src ./account-service/src

# Install Maven and build the project
RUN apt-get update && apt-get install -y maven && \
    mvn clean install -DskipTests -pl account-service -am && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/account-service

EXPOSE 8082

CMD ["java", "-jar", "target/*.jar"]


