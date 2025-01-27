FROM openjdk:17-jdk-alpine

COPY target/auctionservice-0.0.1-SNAPSHOT.jar /app/auctionservice.jar

EXPOSE 8090

ENTRYPOINT ["java","-jar","/app/auctionservice.jar"]
