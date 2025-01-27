CREATE DATABASE IF NOT EXISTS userservicedb;
CREATE DATABASE IF NOT EXISTS notificationservicedb;
CREATE DATABASE IF NOT EXISTS auctionservicedb;

GRANT ALL PRIVILEGES ON userservicedb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON notificationservicedb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON auctionservicedb.* TO 'root'@'%';
FLUSH PRIVILEGES;
