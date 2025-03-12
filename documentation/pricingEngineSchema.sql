CREATE DATABASE cycle_db;
-- Choose the database 
use cycle_db;

-- Note we have frist CREATE the Brands table for making relationship with Items

-- Create the brands tables
CREATE TABLE brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL UNIQUE,
    is_active CHAR(1) NOT NULL DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
    modified_by VARCHAR(255) NOT NULL DEFAULT 'admin',
    modified_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


drop table brands;
-- Create the Items table 
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    valid_to DATETIME NOT NULL,
    brand_id INT NOT NULL,
    is_active CHAR(1) NOT NULL DEFAULT 'Y' CHECK (is_active IN ('Y','N')),
    modified_by VARCHAR(255) NOT NULL DEFAULT 'admin',
    modified_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id) 
);


drop table items;

INSERT into brands(brand_name)
VALUES ('Giant'), ('Hero'),('Atlas'),('Schwinn'),('Avon') ;

INSERT INTO Items (item_name, item_type, price, valid_to, brand_id) VALUES
        -- Steel Frames
        ('Steel', 'Frame', 300.00, '2025-06-01 00:30:38', 1),
        ('Steel', 'Frame', 320.00, '2025-06-01 00:30:38', 2),
        ('Steel', 'Frame', 340.00, '2025-06-01 00:30:38', 3),
        ('Steel', 'Frame', 360.00, '2025-06-01 00:30:38', 4),
        ('Steel', 'Frame', 380.00, '2025-06-01 00:30:38', 5),

        -- Aluminum Frames
        ('Aluminum', 'Frame', 400.00, '2025-06-01 00:30:38', 1),
        ('Aluminum', 'Frame', 420.00, '2025-06-01 00:30:38', 2),
        ('Aluminum', 'Frame', 440.00, '2025-06-01 00:30:38', 3),
        ('Aluminum', 'Frame', 460.00, '2025-06-01 00:30:38', 4),
        ('Aluminum', 'Frame', 480.00, '2025-06-01 00:30:38', 5),

        -- Carbon Fiber Frames
        ('Carbon Fiber', 'Frame', 900.00, '2025-06-01 00:30:38', 1),
        ('Carbon Fiber', 'Frame', 920.00, '2025-06-01 00:30:38', 2),
        ('Carbon Fiber', 'Frame', 940.00, '2025-06-01 00:30:38', 3),
        ('Carbon Fiber', 'Frame', 960.00, '2025-06-01 00:30:38', 4),
        ('Carbon Fiber', 'Frame', 980.00, '2025-06-01 00:30:38', 5),

        -- Flat Handlebars
        ('Flat', 'Handlebar', 200.00, '2025-06-01 00:30:38', 1),
        ('Flat', 'Handlebar', 220.00, '2025-06-01 00:30:38', 2),
        ('Flat', 'Handlebar', 240.00, '2025-06-01 00:30:38', 3),
        ('Flat', 'Handlebar', 260.00, '2025-06-01 00:30:38', 4),
        ('Flat', 'Handlebar', 280.00, '2025-06-01 00:30:38', 5),

        -- Riser Handlebars
        ('Riser', 'Handlebar', 150.00, '2025-06-01 00:30:38', 1),
        ('Riser', 'Handlebar', 170.00, '2025-06-01 00:30:38', 2),
        ('Riser', 'Handlebar', 190.00, '2025-06-01 00:30:38', 3),
        ('Riser', 'Handlebar', 210.00, '2025-06-01 00:30:38', 4),
        ('Riser', 'Handlebar', 230.00, '2025-06-01 00:30:38', 5),

        -- Cruiser Handlebars
        ('Cruiser', 'Handlebar', 300.00, '2025-06-01 00:30:38', 1),
        ('Cruiser', 'Handlebar', 320.00, '2025-06-01 00:30:38', 2),
        ('Cruiser', 'Handlebar', 340.00, '2025-06-01 00:30:38', 3),
        ('Cruiser', 'Handlebar', 360.00, '2025-06-01 00:30:38', 4),
        ('Cruiser', 'Handlebar', 380.00, '2025-06-01 00:30:38', 5),

        -- Upright Seating
        ('Upright', 'Seating', 200.00, '2025-06-01 00:30:38', 1),
        ('Upright', 'Seating', 220.00, '2025-06-01 00:30:38', 2),
        ('Upright', 'Seating', 240.00, '2025-06-01 00:30:38', 3),
        ('Upright', 'Seating', 260.00, '2025-06-01 00:30:38', 4),
        ('Upright', 'Seating', 280.00, '2025-06-01 00:30:38', 5),

        -- Aero Seating
        ('Aero', 'Seating', 250.00, '2025-06-01 00:30:38', 1),
        ('Aero', 'Seating', 270.00, '2025-06-01 00:30:38', 2),
        ('Aero', 'Seating', 290.00, '2025-06-01 00:30:38', 3),
        ('Aero', 'Seating', 310.00, '2025-06-01 00:30:38', 4),
        ('Aero', 'Seating', 330.00, '2025-06-01 00:30:38', 5),

        -- Climbing Seating
        ('Climbing', 'Seating', 300.00, '2025-06-01 00:30:38', 1),
        ('Climbing', 'Seating', 320.00, '2025-06-01 00:30:38', 2),
        ('Climbing', 'Seating', 340.00, '2025-06-01 00:30:38', 3),
        ('Climbing', 'Seating', 360.00, '2025-06-01 00:30:38', 4),
        ('Climbing', 'Seating', 380.00, '2025-06-01 00:30:38', 5),

        -- Spokes Wheels
        ('Spokes', 'Wheel', 350.00, '2025-06-01 00:30:38', 1),
        ('Spokes', 'Wheel', 370.00, '2025-06-01 00:30:38', 2),
        ('Spokes', 'Wheel', 390.00, '2025-06-01 00:30:38', 3),
        ('Spokes', 'Wheel', 410.00, '2025-06-01 00:30:38', 4),
        ('Spokes', 'Wheel', 430.00, '2025-06-01 00:30:38', 5),

        -- Rim Wheels
        ('Rim', 'Wheel', 300.00, '2025-06-01 00:30:38', 1),
        ('Rim', 'Wheel', 320.00, '2025-06-01 00:30:38', 2),
        ('Rim', 'Wheel', 340.00, '2025-06-01 00:30:38', 3),
        ('Rim', 'Wheel', 360.00, '2025-06-01 00:30:38', 4),
        ('Rim', 'Wheel', 380.00, '2025-06-01 00:30:38', 5),

        -- V-Brake Brakes
        ('V-Brake', 'Brakes', 350.00, '2025-06-01 00:30:38', 1),
        ('V-Brake', 'Brakes', 370.00, '2025-06-01 00:30:38', 2),
        ('V-Brake', 'Brakes', 390.00, '2025-06-01 00:30:38', 3),
        ('V-Brake', 'Brakes', 410.00, '2025-06-01 00:30:38', 4),
        ('V-Brake', 'Brakes', 430.00, '2025-06-01 00:30:38', 5),

        -- Disc Brakes
        ('Disc', 'Brakes', 450.00, '2025-06-01 00:30:38', 1),
        ('Disc', 'Brakes', 470.00, '2025-06-01 00:30:38', 2),
        ('Disc', 'Brakes', 490.00, '2025-06-01 00:30:38', 3),
        ('Disc', 'Brakes', 510.00, '2025-06-01 00:30:38', 4),
        ('Disc', 'Brakes', 530.00, '2025-06-01 00:30:38', 5),

        -- Cantilever Brakes
        ('Cantilever', 'Brakes', 450.00, '2025-06-01 00:30:38', 1),
        ('Cantilever', 'Brakes', 470.00, '2025-06-01 00:30:38', 2),
        ('Cantilever', 'Brakes', 490.00, '2025-06-01 00:30:38', 3),
        ('Cantilever', 'Brakes', 510.00, '2025-06-01 00:30:38', 4),
        ('Cantilever', 'Brakes', 530.00, '2025-06-01 00:30:38', 5),

        -- Tube Tyres
        ('Tube', 'Tyre', 150.00, '2025-06-01 00:30:38', 1),
        ('Tube', 'Tyre', 170.00, '2025-06-01 00:30:38', 2),
        ('Tube', 'Tyre', 190.00, '2025-06-01 00:30:38', 3),
        ('Tube', 'Tyre', 210.00, '2025-06-01 00:30:38', 4),
        ('Tube', 'Tyre', 230.00, '2025-06-01 00:30:38', 5),

        -- Tubeless Tyres
        ('Tubeless', 'Tyre', 250.00, '2025-06-01 00:30:38', 1),
        ('Tubeless', 'Tyre', 270.00, '2025-06-01 00:30:38', 2),
        ('Tubeless', 'Tyre', 290.00, '2025-06-01 00:30:38', 3),
        ('Tubeless', 'Tyre', 310.00, '2025-06-01 00:30:38', 4),
        ('Tubeless', 'Tyre', 330.00, '2025-06-01 00:30:38', 5),

        -- 4 Gears Chain Assembly
        ('4 Gears', 'Chain Assembly', 170.00, '2025-06-01 00:30:38', 1),
        ('4 Gears', 'Chain Assembly', 190.00, '2025-06-01 00:30:38', 2),
        ('4 Gears', 'Chain Assembly', 210.00, '2025-06-01 00:30:38', 3),
        ('4 Gears', 'Chain Assembly', 230.00, '2025-06-01 00:30:38', 4),
        ('4 Gears', 'Chain Assembly', 250.00, '2025-06-01 00:30:38', 5),

        -- 6 Gears Chain Assembly
        ('6 Gears', 'Chain Assembly', 750.00, '2025-06-01 00:30:38', 1),
        ('6 Gears', 'Chain Assembly', 770.00, '2025-06-01 00:30:38', 2),
        ('6 Gears', 'Chain Assembly', 790.00, '2025-06-01 00:30:38', 3),
        ('6 Gears', 'Chain Assembly', 810.00, '2025-06-01 00:30:38', 4),
        ('6 Gears', 'Chain Assembly', 830.00, '2025-06-01 00:30:38', 5),

        -- 8 Gears Chain Assembly
        ('8 Gears', 'Chain Assembly', 350.00, '2025-06-01 00:30:38', 1),
        ('8 Gears', 'Chain Assembly', 370.00, '2025-06-01 00:30:38', 2),
        ('8 Gears', 'Chain Assembly', 390.00, '2025-06-01 00:30:38', 3),
        ('8 Gears', 'Chain Assembly', 410.00, '2025-06-01 00:30:38', 4),
        ('8 Gears', 'Chain Assembly', 430.00, '2025-06-01 00:30:38', 5);




SELECT * FROM items;

select * from items where item_name = "Disc";
SELECT * FROM brands;