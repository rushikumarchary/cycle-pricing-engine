# Cycle Pricing Engine

A comprehensive web application built with React and Vite that enables bicycle retailers and manufacturers to manage cycle components, configure custom bicycles, and generate accurate price estimates. The application provides a user-friendly interface for managing inventory, configuring bicycles, and calculating costs including GST.

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
- React 19
- Vite
- React Router DOM for navigation
- Tailwind CSS for styling
- SweetAlert2 for notifications
- Axios for API requests
- React Icons for UI elements

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

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

To create a production build:
```bash
npm run build
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### API Integration
The application integrates with a backend API running on `http://localhost:8080` with the following endpoints:
- `/brand/*` - Brand management endpoints
- `/item/*` - Item management endpoints
- `/auth/*` - Authentication endpoints
- `/estimate/*` - Estimate management endpoints

## Security
- Basic authentication for admin operations
- JWT-based authentication for user sessions
- Role-based access control
- Secure API communication

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
