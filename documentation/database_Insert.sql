-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: cycle_db
-- ------------------------------------------------------
-- Server version    8.0.41

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
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES 
    (1, 'APARTMENT', 'Goldmine Society', 'High street', 'Moshi', '', '221D', 'akshay', 'near NSE', '7262981451', '412105', 'Maharashtra', 1, 2);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES 
    (1, 'Jagur', 'Y', 'Admin', '2025-03-31 20:23:36'),
    (2, 'giant', 'Y', 'Admin', '2025-03-31 20:23:36'),
    (3, 'atlas', 'Y', 'Admin', '2025-03-31 20:23:36'),
    (4, 'schwinn', 'Y', 'Admin', '2025-03-31 20:23:36'),
    (5, 'avon', 'Y', 'Admin', '2025-03-31 20:23:36');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES 
    (8, 4, '/src/assets/cycle5.png', 5, 2),
    (13, 1, '/src/assets/cycle3.webp', 3, 2),
    (14, 1, '/src/assets/cycle2.webp', 2, 2),
    (15, 1, '/src/assets/cycle5.png', 5, 2),
    (16, 1, '/src/assets/cycle3.webp', 3, 2);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES 
    (50, 8, 15),
    (51, 8, 30),
    (52, 8, 40),
    (53, 8, 50),
    (54, 8, 60),
    (55, 8, 75),
    (56, 8, 85),
    (85, 13, 8),
    (86, 13, 18),
    (87, 13, 33),
    (88, 13, 48),
    (89, 13, 63),
    (90, 13, 73),
    (91, 13, 83),
    (92, 14, 3),
    (93, 14, 17),
    (94, 14, 37),
    (95, 14, 47),
    (96, 14, 57),
    (97, 14, 72),
    (98, 14, 82),
    (99, 15, 10),
    (100, 15, 25),
    (101, 15, 40),
    (102, 15, 50),
    (103, 15, 60),
    (104, 15, 75),
    (105, 15, 95),
    (106, 16, 13),
    (107, 16, 18),
    (108, 16, 38),
    (109, 16, 53),
    (110, 16, 58),
    (111, 16, 73),
    (112, 16, 88);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES 
    (1, 'new5', 5, 'Y', 'tusharpandao'),
    (2, 'TUSHAR10', 10, 'Y', 'tusharpandao'),
    (4, 'pnA25', 25, 'Y', 'tusharpandao');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cycle_comparison`
--

LOCK TABLES `cycle_comparison` WRITE;
/*!40000 ALTER TABLE `cycle_comparison` DISABLE KEYS */;
INSERT INTO `cycle_comparison` VALUES 
    (10, 'STANDARD', 14, 2),
    (12, 'DELUXE', 13, 2),
    (14, 'PREMIUM', 8, 2);
/*!40000 ALTER TABLE `cycle_comparison` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES 
    (1, 'Y', 'Steel', 'Frame', 'Admin', '2025-03-31 20:24:07', 300.00, '2025-04-30 23:59:59.000000', 1),
    (2, 'N', 'Steel', 'Frame', 'tusharpandao', '2025-04-02 09:58:39', 320.00, '2025-04-10 23:59:59.000000', 2),
    (3, 'Y', 'Steel', 'Frame', 'Manager', '2025-03-31 20:24:07', 340.00, '2025-04-20 23:59:59.000000', 2),
    (4, 'Y', 'Steel', 'Frame', 'Admin', '2025-03-31 20:24:07', 360.00, '2025-04-22 23:59:59.000000', 4),
    (5, 'Y', 'Steel', 'Frame', 'Manager', '2025-03-31 20:24:07', 380.00, '2025-04-18 23:59:59.000000', 5),
    (6, 'Y', 'Aluminum', 'Frame', 'Admin', '2025-03-31 20:24:07', 400.00, '2025-04-15 23:59:59.000000', 1),
    (7, 'Y', 'Aluminum', 'Frame', 'Manager', '2025-03-31 20:24:07', 420.00, '2025-04-25 23:59:59.000000', 2),
    (8, 'Y', 'Aluminum', 'Frame', 'Admin', '2025-03-31 20:24:07', 440.00, '2025-04-12 23:59:59.000000', 3),
    (9, 'Y', 'Aluminum', 'Frame', 'Manager', '2025-03-31 20:24:07', 460.00, '2025-04-28 23:59:59.000000', 4),
    (10, 'Y', 'Aluminum', 'Frame', 'Admin', '2025-03-31 20:24:07', 480.00, '2025-04-16 23:59:59.000000', 5),
    (11, 'Y', 'Carbon Fiber', 'Frame', 'Manager', '2025-03-31 20:24:07', 900.00, '2025-04-22 23:59:59.000000', 1),
    (12, 'Y', 'Carbon Fiber', 'Frame', 'Admin', '2025-03-31 20:24:07', 920.00, '2025-04-14 23:59:59.000000', 2),
    (13, 'Y', 'Carbon Fiber', 'Frame', 'Manager', '2025-03-31 20:24:07', 940.00, '2025-04-26 23:59:59.000000', 3),
    (14, 'Y', 'Carbon Fiber', 'Frame', 'Admin', '2025-03-31 20:24:07', 960.00, '2025-04-19 23:59:59.000000', 4),
    (15, 'Y', 'Carbon Fiber', 'Frame', 'Manager', '2025-03-31 20:24:07', 980.00, '2025-04-23 23:59:59.000000', 5),
    (16, 'Y', 'Flat', 'Handlebar', 'Admin', '2025-03-31 20:24:07', 200.00, '2025-04-17 23:59:59.000000', 1),
    (17, 'Y', 'Flat', 'Handlebar', 'Manager', '2025-03-31 20:24:07', 220.00, '2025-04-29 23:59:59.000000', 2),
    (18, 'Y', 'Flat', 'Handlebar', 'Admin', '2025-03-31 20:24:07', 240.00, '2025-04-13 23:59:59.000000', 3),
    (19, 'Y', 'Flat', 'Handlebar', 'Manager', '2025-03-31 20:24:07', 260.00, '2025-04-21 23:59:59.000000', 4),
    (20, 'Y', 'Flat', 'Handlebar', 'Admin', '2025-03-31 20:24:07', 280.00, '2025-04-24 23:59:59.000000', 5),
    (21, 'Y', 'Riser', 'Handlebar', 'Manager', '2025-03-31 20:24:07', 150.00, '2025-04-11 23:59:59.000000', 1),
    (22, 'Y', 'Riser', 'Handlebar', 'Admin', '2025-03-31 20:24:07', 170.00, '2025-04-27 23:59:59.000000', 2),
    (23, 'Y', 'Riser', 'Handlebar', 'Manager', '2025-03-31 20:24:07', 190.00, '2025-04-15 23:59:59.000000', 3),
    (24, 'Y', 'Riser', 'Handlebar', 'Admin', '2025-03-31 20:24:07', 210.00, '2025-04-20 23:59:59.000000', 4),
    (25, 'Y', 'Riser', 'Handlebar', 'Manager', '2025-03-31 20:24:07', 230.00, '2025-04-25 23:59:59.000000', 5),
    (26, 'Y', 'Cruiser', 'Handlebar', 'Admin', '2025-03-31 20:24:07', 300.00, '2025-04-18 23:59:59.000000', 1),
    (27, 'Y', 'Cruiser', 'Handlebar', 'Manager', '2025-03-31 20:24:07', 320.00, '2025-04-12 23:59:59.000000', 2),
    (28, 'Y', 'Cruiser', 'Handlebar', 'Admin', '2025-03-31 20:24:07', 340.00, '2025-04-28 23:59:59.000000', 3),
    (29, 'Y', 'Cruiser', 'Handlebar', 'Manager', '2025-03-31 20:24:07', 360.00, '2025-04-16 23:59:59.000000', 4),
    (30, 'Y', 'Cruiser', 'Handlebar', 'Admin', '2025-03-31 20:24:07', 380.00, '2025-04-22 23:59:59.000000', 5),
    (31, 'Y', 'Upright', 'Seating', 'Manager', '2025-03-31 20:24:07', 200.00, '2025-04-14 23:59:59.000000', 1),
    (32, 'Y', 'Upright', 'Seating', 'Admin', '2025-03-31 20:24:07', 220.00, '2025-04-26 23:59:59.000000', 2),
    (33, 'Y', 'Upright', 'Seating', 'Manager', '2025-03-31 20:24:07', 240.00, '2025-04-19 23:59:59.000000', 3),
    (34, 'Y', 'Upright', 'Seating', 'Admin', '2025-03-31 20:24:07', 260.00, '2025-04-23 23:59:59.000000', 4),
    (35, 'Y', 'Upright', 'Seating', 'Manager', '2025-03-31 20:24:07', 280.00, '2025-04-17 23:59:59.000000', 5),
    (36, 'Y', 'Aero', 'Seating', 'Admin', '2025-03-31 20:24:07', 250.00, '2025-04-29 23:59:59.000000', 1),
    (37, 'Y', 'Aero', 'Seating', 'Manager', '2025-03-31 20:24:07', 270.00, '2025-04-13 23:59:59.000000', 2),
    (38, 'Y', 'Aero', 'Seating', 'Admin', '2025-03-31 20:24:07', 290.00, '2025-04-21 23:59:59.000000', 3),
    (39, 'Y', 'Aero', 'Seating', 'Manager', '2025-03-31 20:24:07', 310.00, '2025-04-24 23:59:59.000000', 4),
    (40, 'Y', 'Aero', 'Seating', 'Admin', '2025-03-31 20:24:07', 330.00, '2025-04-11 23:59:59.000000', 5),
    (41, 'Y', 'Climbing', 'Seating', 'Manager', '2025-03-31 20:24:07', 300.00, '2025-04-27 23:59:59.000000', 1),
    (42, 'Y', 'Climbing', 'Seating', 'Admin', '2025-03-31 20:24:07', 320.00, '2025-04-15 23:59:59.000000', 2),
    (43, 'Y', 'Climbing', 'Seating', 'Manager', '2025-03-31 20:24:07', 340.00, '2025-04-20 23:59:59.000000', 3),
    (44, 'Y', 'Climbing', 'Seating', 'Admin', '2025-03-31 20:24:07', 360.00, '2025-04-25 23:59:59.000000', 4),
    (45, 'Y', 'Climbing', 'Seating', 'Manager', '2025-03-31 20:24:07', 380.00, '2025-04-18 23:59:59.000000', 5),
    (46, 'Y', 'Spokes', 'Wheel', 'Admin', '2025-03-31 20:24:07', 350.00, '2025-04-12 23:59:59.000000', 1),
    (47, 'Y', 'Spokes', 'Wheel', 'Manager', '2025-03-31 20:24:07', 370.00, '2025-04-28 23:59:59.000000', 2),
    (48, 'Y', 'Spokes', 'Wheel', 'Admin', '2025-03-31 20:24:07', 390.00, '2025-04-16 23:59:59.000000', 3),
    (49, 'Y', 'Spokes', 'Wheel', 'Manager', '2025-03-31 20:24:07', 410.00, '2025-04-22 23:59:59.000000', 4),
    (50, 'Y', 'Spokes', 'Wheel', 'Admin', '2025-03-31 20:24:07', 430.00, '2025-04-14 23:59:59.000000', 5),
    (51, 'Y', 'Rim', 'Wheel', 'Manager', '2025-03-31 20:24:07', 300.00, '2025-04-26 23:59:59.000000', 1),
    (52, 'Y', 'Rim', 'Wheel', 'Admin', '2025-03-31 20:24:07', 320.00, '2025-04-19 23:59:59.000000', 2),
    (53, 'Y', 'Rim', 'Wheel', 'Manager', '2025-03-31 20:24:07', 340.00, '2025-04-23 23:59:59.000000', 3),
    (54, 'Y', 'Rim', 'Wheel', 'Admin', '2025-03-31 20:24:07', 360.00, '2025-04-17 23:59:59.000000', 4),
    (55, 'Y', 'Rim', 'Wheel', 'Manager', '2025-03-31 20:24:07', 380.00, '2025-04-29 23:59:59.000000', 5),
    (56, 'Y', 'V-Brake', 'Brakes', 'Admin', '2025-03-31 20:24:07', 350.00, '2025-04-13 23:59:59.000000', 1),
    (57, 'Y', 'V-Brake', 'Brakes', 'Manager', '2025-03-31 20:24:07', 370.00, '2025-04-21 23:59:59.000000', 2),
    (58, 'Y', 'V-Brake', 'Brakes', 'Admin', '2025-03-31 20:24:07', 390.00, '2025-04-24 23:59:59.000000', 3),
    (59, 'Y', 'V-Brake', 'Brakes', 'Manager', '2025-03-31 20:24:07', 410.00, '2025-04-11 23:59:59.000000', 4),
    (60, 'Y', 'V-Brake', 'Brakes', 'Admin', '2025-03-31 20:24:07', 430.00, '2025-04-27 23:59:59.000000', 5),
    (61, 'Y', 'Disc', 'Brakes', 'Manager', '2025-03-31 20:24:07', 450.00, '2025-04-15 23:59:59.000000', 1),
    (62, 'Y', 'Disc', 'Brakes', 'Admin', '2025-03-31 20:24:07', 470.00, '2025-04-20 23:59:59.000000', 2),
    (63, 'Y', 'Disc', 'Brakes', 'Manager', '2025-03-31 20:24:07', 490.00, '2025-04-25 23:59:59.000000', 3),
    (64, 'Y', 'Disc', 'Brakes', 'Admin', '2025-03-31 20:24:07', 510.00, '2025-04-18 23:59:59.000000', 4),
    (65, 'Y', 'Disc', 'Brakes', 'Manager', '2025-03-31 20:24:07', 530.00, '2025-04-12 23:59:59.000000', 5),
    (66, 'Y', 'Cantilever', 'Brakes', 'Admin', '2025-03-31 20:24:07', 450.00, '2025-04-28 23:59:59.000000', 1),
    (67, 'Y', 'Cantilever', 'Brakes', 'Manager', '2025-03-31 20:24:07', 470.00, '2025-04-16 23:59:59.000000', 2),
    (68, 'Y', 'Cantilever', 'Brakes', 'Admin', '2025-03-31 20:24:07', 490.00, '2025-04-22 23:59:59.000000', 3),
    (69, 'Y', 'Cantilever', 'Brakes', 'Manager', '2025-03-31 20:24:07', 510.00, '2025-04-14 23:59:59.000000', 4),
    (70, 'Y', 'Cantilever', 'Brakes', 'Admin', '2025-03-31 20:24:07', 530.00, '2025-04-26 23:59:59.000000', 5),
    (71, 'Y', 'Tube', 'Tyre', 'Manager', '2025-03-31 20:24:07', 150.00, '2025-04-19 23:59:59.000000', 1),
    (72, 'Y', 'Tube', 'Tyre', 'Admin', '2025-03-31 20:24:07', 170.00, '2025-04-23 23:59:59.000000', 2),
    (73, 'Y', 'Tube', 'Tyre', 'Manager', '2025-03-31 20:24:07', 190.00, '2025-04-17 23:59:59.000000', 3),
    (74, 'Y', 'Tube', 'Tyre', 'Admin', '2025-03-31 20:24:07', 210.00, '2025-04-29 23:59:59.000000', 4),
    (75, 'Y', 'Tube', 'Tyre', 'Manager', '2025-03-31 20:24:07', 230.00, '2025-04-13 23:59:59.000000', 5),
    (76, 'Y', 'Tubeless', 'Tyre', 'Admin', '2025-03-31 20:24:07', 250.00, '2025-04-21 23:59:59.000000', 1),
    (77, 'Y', 'Tubeless', 'Tyre', 'Manager', '2025-03-31 20:24:07', 270.00, '2025-04-24 23:59:59.000000', 2),
    (78, 'Y', 'Tubeless', 'Tyre', 'Admin', '2025-03-31 20:24:07', 290.00, '2025-04-11 23:59:59.000000', 3),
    (79, 'Y', 'Tubeless', 'Tyre', 'Manager', '2025-03-31 20:24:07', 310.00, '2025-04-27 23:59:59.000000', 4),
    (80, 'Y', 'Tubeless', 'Tyre', 'Admin', '2025-03-31 20:24:07', 330.00, '2025-04-15 23:59:59.000000', 5),
    (81, 'Y', '4 Gears', 'Chain Assembly', 'Manager', '2025-03-31 20:24:07', 170.00, '2025-04-20 23:59:59.000000', 1),
    (82, 'Y', '4 Gears', 'Chain Assembly', 'Admin', '2025-03-31 20:24:07', 190.00, '2025-04-25 23:59:59.000000', 2),
    (83, 'Y', '4 Gears', 'Chain Assembly', 'Manager', '2025-03-31 20:24:07', 210.00, '2025-04-18 23:59:59.000000', 3),
    (84, 'Y', '4 Gears', 'Chain Assembly', 'Admin', '2025-03-31 20:24:07', 230.00, '2025-04-12 23:59:59.000000', 4),
    (85, 'Y', '4 Gears', 'Chain Assembly', 'Manager', '2025-03-31 20:24:07', 250.00, '2025-04-28 23:59:59.000000', 5),
    (86, 'Y', '6 Gears', 'Chain Assembly', 'Admin', '2025-03-31 20:24:07', 750.00, '2025-04-16 23:59:59.000000', 1),
    (87, 'Y', '6 Gears', 'Chain Assembly', 'Manager', '2025-03-31 20:24:07', 770.00, '2025-04-22 23:59:59.000000', 2),
    (88, 'Y', '6 Gears', 'Chain Assembly', 'Admin', '2025-03-31 20:24:07', 790.00, '2025-04-14 23:59:59.000000', 3),
    (89, 'Y', '6 Gears', 'Chain Assembly', 'Manager', '2025-03-31 20:24:07', 810.00, '2025-04-26 23:59:59.000000', 4),
    (90, 'Y', '6 Gears', 'Chain Assembly', 'Admin', '2025-03-31 20:24:07', 830.00, '2025-04-19 23:59:59.000000', 5),
    (91, 'Y', '8 Gears', 'Chain Assembly', 'Manager', '2025-03-31 20:24:07', 350.00, '2025-04-23 23:59:59.000000', 1),
    (92, 'Y', '8 Gears', 'Chain Assembly', 'Admin', '2025-03-31 20:24:07', 370.00, '2025-04-17 23:59:59.000000', 2),
    (93, 'Y', '8 Gears', 'Chain Assembly', 'Manager', '2025-03-31 20:24:07', 390.00, '2025-04-29 23:59:59.000000', 3),
    (94, 'Y', '8 Gears', 'Chain Assembly', 'Admin', '2025-03-31 20:24:07', 410.00, '2025-04-13 23:59:59.000000', 4),
    (95, 'Y', '8 Gears', 'Chain Assembly', 'Admin', '2025-03-31 20:24:07', 415.00, '2025-04-13 23:59:59.000000', 5);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES 
    (1, 'Jagur', 245, '2025-04-08 08:47:49.272803', 396.9, '2025-04-01 08:47:49.272803', 1, 0, 'Canceled', 2450, '/src/assets/cycle1.webp', 2601.9, 2450, 1, 2),
    (2, 'atlas', 283, '2025-04-08 08:58:35.835272', 458.46, '2025-04-01 08:58:35.835272', 1, 0, 'Confirmed', 2830, '/src/assets/cycle3.webp', 3005.46, 2830, 1, 2),
    (3, 'schwinn', 307, '2025-04-08 09:05:55.802038', 497.34, '2025-04-01 09:05:55.802038', 1, 0, 'Confirmed', 3070, '/src/assets/cycle4.webp', 3260.34, 3070, 1, 2),
    (4, 'Jagur', 240, '2025-04-08 09:10:16.382116', 388.8, '2025-04-01 09:10:16.382116', 1, 0, 'Confirmed', 2400, '/src/assets/cycle1.webp', 2548.8, 2400, 1, 2),
    (5, 'schwinn', 284, '2025-04-08 09:30:39.144561', 460.08, '2025-04-01 09:30:39.144561', 1, 0, 'Confirmed', 2840, '/src/assets/cycle4.webp', 3016.08, 2840, 1, 2),
    (6, 'giant', 183, '2025-04-08 09:30:39.155133', 296.46, '2025-04-01 09:30:39.155133', 1, 0, 'Dispatch', 1830, '/src/assets/cycle2.webp', 1943.46, 1830, 1, 2),
    (7, 'schwinn', 0, '2025-04-08 09:35:21.735549', 561.6, '2025-04-01 09:35:21.735549', 1, 0, 'Dispatch', 3120, '/src/assets/cycle4.webp', 3681.6, 3120, 1, 2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payment_order_mapping`
--

LOCK TABLES `payment_order_mapping` WRITE;
/*!40000 ALTER TABLE `payment_order_mapping` DISABLE KEYS */;
INSERT INTO `payment_order_mapping` VALUES 
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3),
    (4, 4, 4),
    (5, 5, 5),
    (6, 6, 5),
    (7, 7, 6);
/*!40000 ALTER TABLE `payment_order_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payment_orders`
--

LOCK TABLES `payment_orders` WRITE;
/*!40000 ALTER TABLE `payment_orders` DISABLE KEYS */;
INSERT INTO `payment_orders` VALUES 
    (1, 2601.9, '2025-04-01 08:47:53.233723', 'INR', NULL, 'order_QDdrrhrRrZcWN3', NULL, 'CREATED'),
    (2, 3005.46, '2025-04-01 08:58:41.993751', 'INR', 'pay_QDe49tiMUvbldb', 'order_QDe3I04T6Q7E6n', '586b76c9020fdc6c0bd5922881dd64b1fdcbf326823df324aa936f5a2e08d4a8', 'PAID'),
    (3, 3260.34, '2025-04-01 09:06:04.855523', 'INR', 'pay_QDeBeV0EJDfnk7', 'order_QDeB5Pvy4uvdHI', '1b38bd9677d401de4d241e31adcb474f48a8e9d1da39f05019b23caacfde1fb3', 'PAID'),
    (4, 2548.8, '2025-04-01 09:10:17.869049', 'INR', 'pay_QDeFpQoTlltWXO', 'order_QDeFXb8VlhlHRU', 'e54bdcfdbc1a94a5d6c0553483b5b4691bf7851ab3940cad84feaa59ea57e679', 'PAID'),
    (5, 4959.54, '2025-04-01 09:30:40.526942', 'INR', 'pay_QDebFRp9V6MGEO', 'order_QDeb4E0yWLVkU4', '97c2851590a316cc64928a9ac22cbf5e7988f474f08a1137b628b3743d9abb3c', 'PAID'),
    (6, 3681.6, '2025-04-01 09:35:21.882116', 'INR', 'pay_QDegCl9l99oVrU', 'order_QDeg1KIimGhCNI', '0421ee6afda65e5705bd9daa7f0fddc6fca1f35aa5e862659cd7b2f41cc30e23', 'PAID');
/*!40000 ALTER TABLE `payment_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `postal_metadata`
--

LOCK TABLES `postal_metadata` WRITE;
/*!40000 ALTER TABLE `postal_metadata` DISABLE KEYS */;
INSERT INTO `postal_metadata` VALUES 
    (1, 'Branch Post Office', 'Maharashtra', 'India', 'Delivery', 'Pune', 'Pune Moffusil', 'Pune');
/*!40000 ALTER TABLE `postal_metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES 
    (1, 'ADMIN'),
    (3, 'EMPLOYEE'),
    (2, 'MANAGER'),
    (4, 'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `specifications`
--

LOCK TABLES `specifications` WRITE;
/*!40000 ALTER TABLE `specifications` DISABLE KEYS */;
INSERT INTO `specifications` VALUES 
    (1, 'Disc', '6 Gears', 'Aluminum', 'Flat', 'Upright', 'Tube', 'Rim', 1),
    (2, 'Cantilever', '8 Gears', 'Carbon Fiber', 'Flat', 'Upright', 'Tube', 'Rim', 2),
    (3, 'Disc', '6 Gears', 'Aluminum', 'Flat', 'Aero', 'Tubeless', 'Spokes', 3),
    (4, 'Disc', '6 Gears', 'Steel', 'Riser', 'Upright', 'Tubeless', 'Rim', 4),
    (5, 'Cantilever', '4 Gears', 'Carbon Fiber', 'Flat', 'Upright', 'Tube', 'Spokes', 5),
    (6, 'V-Brake', '4 Gears', 'Steel', 'Flat', 'Upright', 'Tube', 'Rim', 6),
    (7, 'Disc', '8 Gears', 'Carbon Fiber', 'Riser', 'Aero', 'Tubeless', 'Spokes', 7);
/*!40000 ALTER TABLE `specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES 
    (1, 'admin@itrosys.com', '$2a$12$C.5lpFrPGxaHtyOyhynF3OjIlD4UkO9o/5xH5STcKnkTENJ1W1RMu', '2025-03-31 17:23:03.109103', 'admin', 1),
    (2, 'tushar.pandao@itrosys.com', '$2a$12$.NyAtCK.MXQ9dibULzoOuOjaO/EvkNO0YbCoS0fH9nOhmTELBaG/m', '2025-04-01 08:24:51.081825', 'tusharpandao', 2);
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

-- Dump completed on 2025-04-02 16:57:22