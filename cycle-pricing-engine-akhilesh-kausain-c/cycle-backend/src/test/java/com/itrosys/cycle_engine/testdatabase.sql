-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: cycle_db_test
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL,
  `modified_by` varchar(255) NOT NULL,
  `modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` enum('Y','N') NOT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `brand_name` (`brand_name`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'HERO','Admin','2025-03-12 16:23:38','Y'),(2,'GIANT','Admin','2025-03-12 16:47:57','N'),(3,'ATLAS','Admin','2025-03-02 20:02:40','Y'),(4,'SCHWINN','Admin','2025-03-02 20:02:40','Y'),(5,'AVON','Admin','2025-03-02 20:02:40','Y'),(25,'SONY','Manager','2025-03-03 20:37:34','Y');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `valid_to` datetime NOT NULL,
  `brand_id` int NOT NULL,
  `modified_by` varchar(255) NOT NULL,
  `modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` enum('Y','N') NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `fk_brand` (`brand_id`),
  CONSTRAINT `fk_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Steel','Frame',300.00,'2025-04-30 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(2,'Steel','Frame',320.00,'2025-04-10 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(3,'Steel','Frame',340.00,'2025-04-20 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(4,'Steel','Frame',360.00,'2025-04-22 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(5,'Steel','Frame',380.00,'2025-04-18 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(6,'Aluminum','Frame',400.00,'2025-04-15 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(7,'Aluminum','Frame',420.00,'2025-04-25 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(8,'Aluminum','Frame',440.00,'2025-04-12 23:59:59',3,'Admin','2025-03-02 20:03:25','Y'),(9,'Aluminum','Frame',460.00,'2025-04-28 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(10,'Aluminum','Frame',480.00,'2025-04-16 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(11,'Carbon Fiber','Frame',900.00,'2025-04-22 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(12,'Carbon Fiber','Frame',920.00,'2025-04-14 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(13,'Carbon Fiber','Frame',940.00,'2025-04-26 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(14,'Carbon Fiber','Frame',960.00,'2025-04-19 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(15,'Carbon Fiber','Frame',980.00,'2025-04-23 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(16,'Flat','Handlebar',200.00,'2025-04-17 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(17,'Flat','Handlebar',220.00,'2025-04-29 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(18,'Flat','Handlebar',240.00,'2025-04-13 23:59:59',3,'Admin','2025-03-02 20:03:25','Y'),(19,'Flat','Handlebar',260.00,'2025-04-21 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(20,'Flat','Handlebar',280.00,'2025-04-24 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(21,'Riser','Handlebar',150.00,'2025-04-11 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(22,'Riser','Handlebar',170.00,'2025-04-27 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(23,'Riser','Handlebar',190.00,'2025-04-15 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(24,'Riser','Handlebar',210.00,'2025-04-20 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(25,'Riser','Handlebar',230.00,'2025-04-25 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(26,'Cruiser','Handlebar',300.00,'2025-04-18 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(27,'Cruiser','Handlebar',320.00,'2025-04-12 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(28,'Cruiser','Handlebar',340.00,'2025-04-28 23:59:59',3,'Admin','2025-03-02 20:03:25','Y'),(29,'Cruiser','Handlebar',360.00,'2025-04-16 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(30,'Cruiser','Handlebar',380.00,'2025-04-22 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(31,'Upright','Seating',200.00,'2025-04-14 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(32,'Upright','Seating',220.00,'2025-04-26 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(33,'Upright','Seating',240.00,'2025-04-19 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(34,'Upright','Seating',260.00,'2025-04-23 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(35,'Upright','Seating',280.00,'2025-04-17 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(36,'Aero','Seating',250.00,'2025-04-29 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(37,'Aero','Seating',270.00,'2025-04-13 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(38,'Aero','Seating',290.00,'2025-04-21 23:59:59',3,'Admin','2025-03-04 18:16:45','N'),(39,'Aero','Seating',310.00,'2025-04-24 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(40,'Aero','Seating',330.00,'2025-04-11 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(41,'Climbing','Seating',300.00,'2025-04-27 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(42,'Climbing','Seating',320.00,'2025-04-15 23:59:59',2,'Admin','2025-03-04 18:16:45','N'),(43,'Climbing','Seating',340.00,'2025-04-20 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(44,'Climbing','Seating',360.00,'2025-04-25 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(45,'Climbing','Seating',380.00,'2025-04-18 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(46,'Spokes','Wheel',350.00,'2025-04-12 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(47,'Spokes','Wheel',370.00,'2025-04-28 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(48,'Spokes','Wheel',390.00,'2025-04-16 23:59:59',3,'Admin','2025-03-02 20:03:25','Y'),(49,'Spokes','Wheel',410.00,'2025-04-22 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(50,'Spokes','Wheel',430.00,'2025-04-14 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(51,'Rim','Wheel',300.00,'2025-04-26 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(52,'Rim','Wheel',320.00,'2025-04-19 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(53,'Rim','Wheel',340.00,'2025-04-23 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(54,'Rim','Wheel',360.00,'2025-04-17 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(55,'Rim','Wheel',380.00,'2025-04-29 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(56,'V-Brake','Brakes',350.00,'2025-04-13 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(57,'V-Brake','Brakes',370.00,'2025-04-21 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(58,'V-Brake','Brakes',390.00,'2025-04-24 23:59:59',3,'Admin','2025-03-02 20:03:25','Y'),(59,'V-Brake','Brakes',410.00,'2025-04-11 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(60,'V-Brake','Brakes',430.00,'2025-04-27 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(61,'Disc','Brakes',450.00,'2025-04-15 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(62,'Disc','Brakes',470.00,'2025-04-20 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(63,'Disc','Brakes',490.00,'2025-04-25 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(64,'Disc','Brakes',510.00,'2025-04-18 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(65,'Disc','Brakes',530.00,'2025-04-12 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(66,'Cantilever','Brakes',450.00,'2025-04-28 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(67,'Cantilever','Brakes',470.00,'2025-04-16 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(68,'Cantilever','Brakes',490.00,'2025-04-22 23:59:59',3,'Admin','2025-03-02 20:03:25','Y'),(69,'Cantilever','Brakes',510.00,'2025-04-14 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(70,'Cantilever','Brakes',530.00,'2025-04-26 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(71,'Tube','Tyre',150.00,'2025-04-19 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(72,'Tube','Tyre',170.00,'2025-04-23 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(73,'Tube','Tyre',190.00,'2025-04-17 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(74,'Tube','Tyre',210.00,'2025-04-29 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(75,'Tube','Tyre',230.00,'2025-04-13 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(76,'Tubeless','Tyre',250.00,'2025-04-21 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(77,'Tubeless','Tyre',270.00,'2025-04-24 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(78,'Tubeless','Tyre',290.00,'2025-04-11 23:59:59',3,'Admin','2025-03-02 20:03:25','Y'),(79,'Tubeless','Tyre',310.00,'2025-04-27 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(80,'Tubeless','Tyre',330.00,'2025-04-15 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(81,'4 Gears','Chain Assembly',170.00,'2025-04-20 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(82,'4 Gears','Chain Assembly',190.00,'2025-04-25 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(83,'4 Gears','Chain Assembly',210.00,'2025-04-18 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(84,'4 Gears','Chain Assembly',230.00,'2025-04-12 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(85,'4 Gears','Chain Assembly',250.00,'2025-04-28 23:59:59',5,'Manager','2025-03-02 20:03:25','Y'),(86,'6 Gears','Chain Assembly',750.00,'2025-04-16 23:59:59',1,'Admin','2025-03-12 16:22:51','Y'),(87,'6 Gears','Chain Assembly',770.00,'2025-04-22 23:59:59',2,'Manager','2025-03-12 16:48:28','N'),(88,'6 Gears','Chain Assembly',790.00,'2025-04-14 23:59:59',3,'Admin','2025-03-02 20:03:25','Y'),(89,'6 Gears','Chain Assembly',810.00,'2025-04-26 23:59:59',4,'Manager','2025-03-04 18:16:45','N'),(90,'6 Gears','Chain Assembly',830.00,'2025-04-19 23:59:59',5,'Admin','2025-03-02 20:03:25','Y'),(91,'8 Gears','Chain Assembly',350.00,'2025-04-23 23:59:59',1,'Manager','2025-03-12 16:22:51','Y'),(92,'8 Gears','Chain Assembly',370.00,'2025-04-17 23:59:59',2,'Admin','2025-03-12 16:48:28','N'),(93,'8 Gears','Chain Assembly',390.00,'2025-04-29 23:59:59',3,'Manager','2025-03-02 20:03:25','Y'),(94,'8 Gears','Chain Assembly',410.00,'2025-04-13 23:59:59',4,'Admin','2025-03-04 18:16:45','N'),(95,'8 Gears','Chain Assembly',415.00,'2025-04-13 23:59:59',5,'Admin','2025-03-02 20:03:25','Y');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `UK716hgxp60ym1lifrdgp67xt5k` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-12 18:00:54
