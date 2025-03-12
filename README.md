# Cycle Pricing Engine (Backend)

A **Spring Boot-based backend** for the Cycle Pricing Engine, designed to manage brands, items, pricing calculations, and user authentication with JWT security. The backend provides RESTful APIs for inventory management, cycle configuration, and price estimation.

## 🚀 Features

### 1. Inventory Management
- **Brand Management:** Add, update, and delete brands.
- **Item Management:** CRUD operations for items, price tracking, and bulk operations.
- **Price History:** Maintain price validity periods.

### 2. Cycle Configuration
- Dynamic selection of cycle components.
- Real-time pricing calculations.
- GST (18%) inclusion.

### 3. User Authentication & Security
- JWT-based authentication & authorization.
- Role-based access control (Admin, Manager, User).

### 4. Multithreading for Bulk Processing
- Uses ExecutorService for parallel pricing calculations.

---

## 🛠️ Tech Stack

- **Java 17**
- **Spring Boot** (REST API framework)
- **Spring Security & JWT** (Authentication & Authorization)
- **Spring Data JPA** (ORM for MySQL)
- **MySQL** (Database storage)
- **Lombok** (Reduces boilerplate code)
- **Swagger** (API Documentation)
- **Mockito & JUnit** (Unit Testing)

---

## 📦 Installation & Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL Server

### Steps
1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd CyclePricingEngine
   ```
2. **Configure the Database:**
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cycle_db
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   ```
3. **Build and Run the Application:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The backend will start at `http://localhost:8081`.

---

## 🔥 API Endpoints

### **Brand Management**
- `GET /brands` - Get all brands
- `POST /brands` - Create a new brand
- `GET /brands/{id}` - Get brand by ID
- `PUT /brands/{id}` - Update a brand
- `DELETE /brands/{id}` - Soft delete a brand

### **Item Management**
- `GET /items` - Get all items
- `POST /items` - Create a new item
- `GET /items/{id}` - Get item by ID
- `PUT /items/{id}` - Update an item
- `DELETE /items/{id}` - Soft delete an item
- `GET /items/brand/{brandId}` - Get items by brand

### **Cycle Pricing Calculation**
- `POST /cycle-pricing/calculate` - Calculate cycle price for selected components
- `POST /cycle-pricing/calculate-multiple` - Bulk price calculation using multithreading

---

## 🛡️ Security
- JWT-based authentication
- Role-based access control (Admin, Manager, User)
- Password hashing using BCrypt

---

## 📝 Contribution
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Create a Pull Request

---

## 📜 License
This project is licensed under **Itrosys Company**.

---
