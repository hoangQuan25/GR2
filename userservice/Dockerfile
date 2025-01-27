FROM openjdk:17-jdk-alpine

COPY target/userservice-0.0.1-SNAPSHOT.jar /app/userservice.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/userservice.jar"]
