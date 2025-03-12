CREATE DATABASE cycle_db;
-- Choose the database 
use cycle_db;
-- Create the brands tablesY
CREATE TABLE brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL UNIQUE,
    is_active ENUM('Y', 'N') NOT NULL,
    modified_by VARCHAR(255) NOT NULL,
    modified_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- Note we have frist CREATE the Brands table for making relationship with Items
-- Create the Items table 
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    valid_to DATETIME NOT NULL,
    brand_id INT NOT NULL,
    is_active ENUM('Y', 'N') NOT NULL,
    modified_by VARCHAR(255) NOT NULL,
    modified_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id) 
);


select * from brands;
INSERT INTO brands (brand_name, is_active, modified_by) 
VALUES ('Jagur', 'Y', 'Admin'),
	   ('giant', 'Y', 'Admin'),
	   ('atlas', 'Y', 'Admin'),
	   ('schwinn', 'Y', 'Admin'),
	   ('avon', 'Y', 'Admin');

UPDATE brands set brand_name = 'hero' where brand_id=1;
UPDATE brands set is_active = 'N' where brand_id =1;
select * from brands where is_active = 'N';

select * from items;
--	('Hero Sprint Pro', 'Mountain Bike', 15000.00, '2025-12-31 23:59:59', 1, 'Y', 'Admin')
INSERT INTO items (item_name, item_type, price, valid_to, brand_id, is_active, modified_by) VALUES
	
        -- Steel Frames
        ('Steel', 'Frame', 300.00, '2025-4-30 23:59:59', 1,'Y', 'Admin'),
        ('Steel', 'Frame', 320.00, '2025-4-10 23:59:59', 2,'Y', 'Admin'),
        ('Steel', 'Frame', 340.00, '2025-4-20 23:59:59', 2,'Y', 'Manager'),
        ('Steel', 'Frame', 360.00, '2025-4-22 23:59:59', 4,'Y', 'Admin'),
        ('Steel', 'Frame', 380.00, '2025-4-18 23:59:59', 5,'Y', 'Manager'),

        -- Aluminum Frames
        ('Aluminum', 'Frame', 400.00, '2025-4-15 23:59:59', 1,'Y', 'Admin'),
        ('Aluminum', 'Frame', 420.00, '2025-4-25 23:59:59', 2,'Y', 'Manager'),
        ('Aluminum', 'Frame', 440.00, '2025-4-12 23:59:59', 3,'Y', 'Admin'),
        ('Aluminum', 'Frame', 460.00, '2025-4-28 23:59:59', 4,'Y', 'Manager'),
        ('Aluminum', 'Frame', 480.00, '2025-4-16 23:59:59', 5,'Y', 'Admin'),

        -- Carbon Fiber Frames
        ('Carbon Fiber', 'Frame', 900.00, '2025-4-22 23:59:59', 1,'Y', 'Manager'),
        ('Carbon Fiber', 'Frame', 920.00, '2025-4-14 23:59:59', 2,'Y', 'Admin'),
        ('Carbon Fiber', 'Frame', 940.00, '2025-4-26 23:59:59', 3,'Y', 'Manager'),
        ('Carbon Fiber', 'Frame', 960.00, '2025-4-19 23:59:59', 4,'Y', 'Admin'),
        ('Carbon Fiber', 'Frame', 980.00, '2025-4-23 23:59:59', 5,'Y', 'Manager'),

        -- Flat Handlebars
        ('Flat', 'Handlebar', 200.00, '2025-4-17 23:59:59', 1,'Y', 'Admin'),
        ('Flat', 'Handlebar', 220.00, '2025-4-29 23:59:59', 2,'Y', 'Manager'),
        ('Flat', 'Handlebar', 240.00, '2025-4-13 23:59:59', 3,'Y', 'Admin'),
        ('Flat', 'Handlebar', 260.00, '2025-4-21 23:59:59', 4,'Y', 'Manager'),
        ('Flat', 'Handlebar', 280.00, '2025-4-24 23:59:59', 5,'Y', 'Admin'),

        -- Riser Handlebars
        ('Riser', 'Handlebar', 150.00, '2025-4-11 23:59:59', 1,'Y', 'Manager'),
        ('Riser', 'Handlebar', 170.00, '2025-4-27 23:59:59', 2,'Y', 'Admin'),
        ('Riser', 'Handlebar', 190.00, '2025-4-15 23:59:59', 3,'Y', 'Manager'),
        ('Riser', 'Handlebar', 210.00, '2025-4-20 23:59:59', 4,'Y', 'Admin'),
        ('Riser', 'Handlebar', 230.00, '2025-4-25 23:59:59', 5,'Y', 'Manager'),

        -- Cruiser Handlebars
        ('Cruiser', 'Handlebar', 300.00, '2025-4-18 23:59:59', 1,'Y', 'Admin'),
        ('Cruiser', 'Handlebar', 320.00, '2025-4-12 23:59:59', 2,'Y', 'Manager'),
        ('Cruiser', 'Handlebar', 340.00, '2025-4-28 23:59:59', 3,'Y', 'Admin'),
        ('Cruiser', 'Handlebar', 360.00, '2025-4-16 23:59:59', 4,'Y', 'Manager'),
        ('Cruiser', 'Handlebar', 380.00, '2025-4-22 23:59:59', 5,'Y', 'Admin'),

        -- Upright Seating
        ('Upright', 'Seating', 200.00, '2025-4-14 23:59:59', 1,'Y', 'Manager'),
        ('Upright', 'Seating', 220.00, '2025-4-26 23:59:59', 2,'Y', 'Admin'),
        ('Upright', 'Seating', 240.00, '2025-4-19 23:59:59', 3,'Y', 'Manager'),
        ('Upright', 'Seating', 260.00, '2025-4-23 23:59:59', 4,'Y', 'Admin'),
        ('Upright', 'Seating', 280.00, '2025-4-17 23:59:59', 5,'Y', 'Manager'),

        -- Aero Seating
        ('Aero', 'Seating', 250.00, '2025-4-29 23:59:59', 1,'Y', 'Admin'),
        ('Aero', 'Seating', 270.00, '2025-4-13 23:59:59', 2,'Y', 'Manager'),
        ('Aero', 'Seating', 290.00, '2025-4-21 23:59:59', 3,'Y', 'Admin'),
        ('Aero', 'Seating', 310.00, '2025-4-24 23:59:59', 4,'Y', 'Manager'),
        ('Aero', 'Seating', 330.00, '2025-4-11 23:59:59', 5,'Y', 'Admin'),

        -- Climbing Seating
        ('Climbing', 'Seating', 300.00, '2025-4-27 23:59:59', 1,'Y', 'Manager'),
        ('Climbing', 'Seating', 320.00, '2025-4-15 23:59:59', 2,'Y', 'Admin'),
        ('Climbing', 'Seating', 340.00, '2025-4-20 23:59:59', 3,'Y', 'Manager'),
        ('Climbing', 'Seating', 360.00, '2025-4-25 23:59:59', 4,'Y', 'Admin'),
        ('Climbing', 'Seating', 380.00, '2025-4-18 23:59:59', 5,'Y', 'Manager'),

        -- Spokes Wheels
        ('Spokes', 'Wheel', 350.00, '2025-4-12 23:59:59', 1,'Y', 'Admin'),
        ('Spokes', 'Wheel', 370.00, '2025-4-28 23:59:59', 2,'Y', 'Manager'),
        ('Spokes', 'Wheel', 390.00, '2025-4-16 23:59:59', 3,'Y', 'Admin'),
        ('Spokes', 'Wheel', 410.00, '2025-4-22 23:59:59', 4,'Y', 'Manager'),
        ('Spokes', 'Wheel', 430.00, '2025-4-14 23:59:59', 5,'Y', 'Admin'),

        -- Rim Wheels
        ('Rim', 'Wheel', 300.00, '2025-4-26 23:59:59', 1,'Y', 'Manager'),
        ('Rim', 'Wheel', 320.00, '2025-4-19 23:59:59', 2,'Y', 'Admin'),
        ('Rim', 'Wheel', 340.00, '2025-4-23 23:59:59', 3,'Y', 'Manager'),
        ('Rim', 'Wheel', 360.00, '2025-4-17 23:59:59', 4,'Y', 'Admin'),
        ('Rim', 'Wheel', 380.00, '2025-4-29 23:59:59', 5,'Y', 'Manager'),

        -- V-Brake Brakes
        ('V-Brake', 'Brakes', 350.00, '2025-4-13 23:59:59', 1,'Y', 'Admin'),
        ('V-Brake', 'Brakes', 370.00, '2025-4-21 23:59:59', 2,'Y', 'Manager'),
        ('V-Brake', 'Brakes', 390.00, '2025-4-24 23:59:59', 3,'Y', 'Admin'),
        ('V-Brake', 'Brakes', 410.00, '2025-4-11 23:59:59', 4,'Y', 'Manager'),
        ('V-Brake', 'Brakes', 430.00, '2025-4-27 23:59:59', 5,'Y', 'Admin'),

        -- Disc Brakes
        ('Disc', 'Brakes', 450.00, '2025-4-15 23:59:59', 1,'Y', 'Manager'),
        ('Disc', 'Brakes', 470.00, '2025-4-20 23:59:59', 2,'Y', 'Admin'),
        ('Disc', 'Brakes', 490.00, '2025-4-25 23:59:59', 3,'Y', 'Manager'),
        ('Disc', 'Brakes', 510.00, '2025-4-18 23:59:59', 4,'Y', 'Admin'),
        ('Disc', 'Brakes', 530.00, '2025-4-12 23:59:59', 5,'Y', 'Manager'),

        -- Cantilever Brakes
        ('Cantilever', 'Brakes', 450.00, '2025-4-28 23:59:59', 1,'Y', 'Admin'),
        ('Cantilever', 'Brakes', 470.00, '2025-4-16 23:59:59', 2,'Y', 'Manager'),
        ('Cantilever', 'Brakes', 490.00, '2025-4-22 23:59:59', 3,'Y', 'Admin'),
        ('Cantilever', 'Brakes', 510.00, '2025-4-14 23:59:59', 4,'Y', 'Manager'),
        ('Cantilever', 'Brakes', 530.00, '2025-4-26 23:59:59', 5,'Y', 'Admin'),

        -- Tube Tyres
        ('Tube', 'Tyre', 150.00, '2025-4-19 23:59:59', 1,'Y', 'Manager'),
        ('Tube', 'Tyre', 170.00, '2025-4-23 23:59:59', 2,'Y', 'Admin'),
        ('Tube', 'Tyre', 190.00, '2025-4-17 23:59:59', 3,'Y', 'Manager'),
        ('Tube', 'Tyre', 210.00, '2025-4-29 23:59:59', 4,'Y', 'Admin'),
        ('Tube', 'Tyre', 230.00, '2025-4-13 23:59:59', 5,'Y', 'Manager'),

        -- Tubeless Tyres
        ('Tubeless', 'Tyre', 250.00, '2025-4-21 23:59:59', 1,'Y', 'Admin'),
        ('Tubeless', 'Tyre', 270.00, '2025-4-24 23:59:59', 2,'Y', 'Manager'),
        ('Tubeless', 'Tyre', 290.00, '2025-4-11 23:59:59', 3,'Y', 'Admin'),
        ('Tubeless', 'Tyre', 310.00, '2025-4-27 23:59:59', 4,'Y', 'Manager'),
        ('Tubeless', 'Tyre', 330.00, '2025-4-15 23:59:59', 5,'Y', 'Admin'),

        -- 4 Gears Chain Assembly
        ('4 Gears', 'Chain Assembly', 170.00, '2025-4-20 23:59:59', 1,'Y', 'Manager'),
        ('4 Gears', 'Chain Assembly', 190.00, '2025-4-25 23:59:59', 2,'Y', 'Admin'),
        ('4 Gears', 'Chain Assembly', 210.00, '2025-4-18 23:59:59', 3,'Y', 'Manager'),
        ('4 Gears', 'Chain Assembly', 230.00, '2025-4-12 23:59:59', 4,'Y', 'Admin'),
        ('4 Gears', 'Chain Assembly', 250.00, '2025-4-28 23:59:59', 5,'Y', 'Manager'),

        -- 6 Gears Chain Assembly
        ('6 Gears', 'Chain Assembly', 750.00, '2025-4-16 23:59:59', 1,'Y', 'Admin'),
        ('6 Gears', 'Chain Assembly', 770.00, '2025-4-22 23:59:59', 2,'Y', 'Manager'),
        ('6 Gears', 'Chain Assembly', 790.00, '2025-4-14 23:59:59', 3,'Y', 'Admin'),
        ('6 Gears', 'Chain Assembly', 810.00, '2025-4-26 23:59:59', 4,'Y', 'Manager'),
        ('6 Gears', 'Chain Assembly', 830.00, '2025-4-19 23:59:59', 5,'Y', 'Admin'),

        -- 8 Gears Chain Assembly
        ('8 Gears', 'Chain Assembly', 350.00, '2025-4-23 23:59:59', 1,'Y', 'Manager'),
        ('8 Gears', 'Chain Assembly', 370.00, '2025-4-17 23:59:59', 2,'Y', 'Admin'),
        ('8 Gears', 'Chain Assembly', 390.00, '2025-4-29 23:59:59', 3,'Y', 'Manager'),
        ('8 Gears', 'Chain Assembly', 410.00, '2025-4-13 23:59:59', 4,'Y', 'Admin'),
         ('8 Gears', 'Chain Assembly', 415.00, '2025-4-13 23:59:59', 5,'Y', 'Admin');
SELECT * FROM items;
SELECT * FROM brands;


UPDATE items set is_active = 'n' where item_id= 2;


SELECT * 
FROM items i 
JOIN brands b ON i.brand_id = b.brand_id
WHERE b.brand_name = 'Hero' 
AND i.item_name IN ('Tubeless', 'Spokes', 'Steel', 'Upright', 'V-Brake', '4 Gears', 'Flat');
