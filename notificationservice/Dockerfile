FROM openjdk:17-jdk-alpine

COPY target/notificationservice-0.0.1-SNAPSHOT.jar /app/notificationservice.jar

EXPOSE 9000

ENTRYPOINT ["java","-jar","/app/notificationservice.jar"]
