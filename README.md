# Cycle Pricing Engine

A comprehensive web application built with React and Spring Boot that enables bicycle retailers and manufacturers to manage cycle components, configure custom bicycles, and generate accurate price estimates. The application provides a user-friendly interface for managing inventory, configuring bicycles, and calculating costs, including GST.

This project focuses on calculating the prices for various brands with multiple options for selecting individual items.

## Features

### 1. Inventory Management

- **Brand Management:**
  - Add, edit, and delete bicycle brands
  - Brand-wise item categorization
  - Brand activity status tracking

- **Item Management:**
  - Comprehensive item CRUD operations
  - Price management with validity periods
  - Real-time search functionality
  - Pagination for better data handling
  - Item categorization by brands
  - Bulk item operations
  - Price history tracking

### 2. Cycle Configuration

- **Component Selection:**
  - Brand Selection
  - Frame Material
  - Handlebar Type
  - Seating Options
  - Wheel Types
  - Brake Systems
  - Tyre Options
  - Chain Assembly

### 3. Price Estimation

- Real-time price calculation
- Component-wise price breakdown
- GST calculation (18%)
- Final price computation
- Save estimates for future reference
- Price validity period tracking

### 4. User Management

- Role-based access control (Admin, Manager, User)
- User registration system
- Secure login functionality
- Saved estimates history
- User profile management


### 5. Responsive Design

- Mobile-friendly interface
- Responsive navigation
- Adaptive layout for all screen sizes
- Interactive UI elements

## Technical Stack

### Frontend

- **React 19**
- **Vite**
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **SweetAlert2** for notifications
- **Axios** for API requests
- **React Icons** for UI elements

### Backend

- **Java 21**
- **Spring Boot** (RESTful API)
- **Spring Security** (Authentication & Authorization)
- **Spring Data JPA** (Database access)
- **MySQL** (Database)
- **Lombok** (Boilerplate code reduction)
- **Swagger** (API documentation)
- **Mockito** (Unit Testing)

### Key Components

#### 1. Layout Components

- `Navbar`: Responsive navigation bar with mobile menu
- `Footer`: Application footer with links and information
- `Layout`: Main layout wrapper for consistent page structure

#### 2. Feature Components

- `CalculateForm`: Main form for cycle configuration
- `PriceBreakdown`: Detailed price calculation and breakdown
- `Estimates`: Saved estimates display and management
- `HeroSection`: Landing page main section

#### 3. Inventory Management Components

- `GetItems`: Item listing and management interface
- `AddItem`: Modal for adding new items
- `UpdateDateTime`: Modal for updating item validity periods
- `UpdatePrice`: Modal for price management
- `BrandManagement`: Brand CRUD operations interface

#### 4. Authentication Components

- `SignIn`: User login component
- `SignUp`: New user registration
- `AuthContext`: Authentication state management

#### 5. Utility Components

- `ItemManagement`: Inventory management system
- Custom hooks for state management
- Context providers for global state
- Search and filter components

### Backend Modules

#### 1. Authentication Module

- User registration and login
- JWT-based authentication
- Role-based access control

#### 2. Inventory Module

- CRUD operations for brands and items
- Price and availability tracking
- Bulk operations support

#### 3. Cycle Configuration Module

- Store user-configured cycle models
- Dynamic pricing calculations
- GST inclusion and breakdown

#### 4. Order Management Module

- Place, track, and manage orders
- Order history and cancellation

#### 5. Reporting Module

- Sales and revenue tracking
- Data export options (CSV, PDF)
- Periodic report generation

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **Java 21**
- **MySQL Database**
- **npm** or **yarn** package manager

### Installation

#### Frontend

1. Clone the repository
   ```
   git clone [repository-url]
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

#### Backend

1. Clone the repository
   ```
   git clone [backend-repository-url]
   ```

2. Configure the database in `application.properties`
   ```properties
   spring.datasource.url=jdbc:mysql://domain-name:3306/cycle_db
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   ```

3. Build and run the application
   ```
   mvn spring-boot:run
   ```

The backend will run on `http://localhost:8080`.

## Build

To create a production build for the frontend:
```
npm run build
```

To create a production build for the backend:
```
mvn clean package
```

## Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Create frontend production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `mvn spring-boot:run` - Run backend development server

### API Integration

The application integrates with a backend API running on `http://localhost:8080` with the following endpoints:

- `/auth/*` - Authentication endpoints
- `/brand/*` - Brand management endpoints
- `/item/*` - Item management endpoints
- `/estimate/*` - Estimate management endpoints
- `/order/*` - Order processing endpoints
- `/report/*` - Reporting and analytics endpoints

## Security

- **JWT-based authentication** for user sessions
- **Role-based access control** (Admin, Manager, User)
- **Secure API communication**
- **Data validation and encryption**

## License

This project is licensed under the **Itrosys Company this should read in**.
