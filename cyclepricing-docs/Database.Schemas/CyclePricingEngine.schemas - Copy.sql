SELECT * FROM pricingenginecircle;
use pricingenginecircle;
select * from brand;
show tables;

create database pricingenginecircle;
-- create table for brand
CREATE TABLE brand (
    brand_id INT PRIMARY KEY, 
    brand_name VARCHAR(100) NOT NULL
);
-- create table for items
CREATE TABLE items (
    item_id INT PRIMARY KEY NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    valid_to DATE NOT NULL,
    brand_id INT NOT NULL,
    CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brand(brand_id) 
);


INSERT INTO brand (brand_id, brand_name) VALUES
(1, 'Giant'),
(2, 'Trek'),
(3, 'Specialized'),
(4, 'Cannondale'),
(5, 'Scott'),
(6, 'Bianchi'),
(7, 'Merida'),
(8, 'Cervélo'),
(9, 'Santa Cruz'),
(10, 'Fuji');


select * from items;
drop table  cycle_pricing_engine;

INSERT INTO items (item_id, item_name, item_type, price, valid_to, brand_id)  
VALUES  
(1, 'Frame', 'Steel Frame', 5000, '2024-12-31', 1),  
(2, 'Frame', 'Aluminum Frame', 7000, '2024-12-31', 1),  
(3, 'Frame', 'Carbon Frame', 12000, '2024-12-31', 1),  
(4, 'Frame', 'Titanium Frame', 15000, '2024-12-31', 1),  
(5, 'Frame', 'Hybrid Frame', 8000, '2024-12-31', 1),  
(6, 'Frame', 'Aero Frame', 11000, '2024-12-31', 1);  

INSERT INTO items (item_id, item_name, item_type, price, valid_to, brand_id)  
VALUES  
(7, 'Handle Bar', 'Drop Bar', 3200, '2024-12-31', 2),  
(8, 'Handle Bar', 'Flat Bar', 2800, '2024-12-31', 2),  
(9, 'Handle Bar', 'Riser Bar', 2600, '2024-12-31', 2),  
(10, 'Handle Bar', 'Bullhorn Bar', 3000, '2024-12-31', 2),  
(11, 'Handle Bar', 'Aero Bar', 3500, '2024-12-31', 2),  
(12, 'Handle Bar', 'Cruiser Bar', 2700, '2024-12-31', 2),  
(13, 'Handle Bar', 'Butterfly Bar', 2900, '2024-12-31', 2);

INSERT INTO items (item_id, item_name, item_type, price, valid_to, brand_id)  
VALUES  
(14, 'Seating', 'Performance Saddle', 2500, '2024-12-31', 3),  
(15, 'Seating', 'Comfort Saddle', 1800, '2024-12-31', 3),  
(16, 'Seating', 'Gel Saddle', 2200, '2024-12-31', 3),  
(17, 'Seating', 'Leather Saddle', 3000, '2024-12-31', 3),  
(18, 'Seating', 'Mountain Bike Saddle', 2700, '2024-12-31', 3),  
(19, 'Seating', 'Cruiser Saddle', 2000, '2024-12-31', 3);  




INSERT INTO items (item_id, item_name, item_type, price, valid_to, brand_id)  
VALUES  
(20, 'Wheel', 'Tubeless Tyre', 1500, '2024-12-31', 4),  
(21, 'Wheel', 'Spoked Wheel', 1300, '2024-12-31', 4),  
(22, 'Wheel', 'Alloy Wheel', 2000, '2024-12-31', 4),  
(23, 'Wheel', 'Carbon Fiber Wheel', 3500, '2024-12-31', 4);  

INSERT INTO items (item_id, item_name, item_type, price, valid_to, brand_id)  
VALUES  
(24, 'Brakes', 'Disc Brake', 3500, '2024-12-31', 5),  
(25, 'Brakes', 'V-Brake', 2200, '2024-12-31', 5),  
(26, 'Brakes', 'Caliper Brake', 2000, '2024-12-31', 5),  
(27, 'Brakes', 'Coaster Brake', 1800, '2024-12-31', 5),  
(28, 'Brakes', 'Drum Brake', 2600, '2024-12-31', 5);  

INSERT INTO items (item_id, item_name, item_type, price, valid_to, brand_id)  
VALUES  
(29, 'Tyre', 'Tubeless Tyre', 2000, '2024-12-31', 6),  
(30, 'Tyre', 'Tube Tyre', 1500, '2024-12-31', 6),  
(31, 'Tyre', 'Road Bike Tyre', 2200, '2024-12-31', 6),  
(32, 'Tyre', 'Mountain Bike Tyre', 2800, '2024-12-31', 6),  
(33, 'Tyre', 'Hybrid Tyre', 2500, '2024-12-31', 6);  


INSERT INTO items (item_id, item_name, item_type, price, valid_to, brand_id)  
VALUES  
(34, 'Chain Assembly', 'Single Speed Chain', 1500, '2024-12-31', 7),  
(35, 'Chain Assembly', 'Multi-Speed Chain', 2500, '2024-12-31', 7),  
(36, 'Chain Assembly', 'Derailleur Chain', 3000, '2024-12-31', 7),  
(37, 'Chain Assembly', 'Belt Drive', 4000, '2024-12-31', 7),  
(38, 'Chain Assembly', 'E-Bike Chain', 3500, '2024-12-31', 7); 





