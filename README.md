# Book Store Backend

This is the backend part of the Book Shop application, built with Node.js and Express. It handles user authentication, product management, orders, and integrates with SurjoPay for payment processing.

## Features

- **User Authentication**: Secure user registration, login, and JWT-based authentication with role management.
- **Product Management**: Admins can create, read, update, and delete products.
- **Order Management**: Users can place orders, and admins can manage orders.
- **Payment Integration**: SurjoPay integration for handling payments.
- **Role-Based Access Control**: Admins can manage users, products, and orders.

## Tech Stack

- Node.js
- Express
- MongoDB (for data storage)
- JWT (for authentication)
- Mongoose (for MongoDB ORM)
- SurjoPay (for payment gateway)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Tawsif05/book-store-server.git
    ```

2. Navigate into the project folder:

    ```bash
    cd book-store-server
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up your environment variables in a `.env` file:

    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    SURJOPAY_API_KEY=your_surjopay_api_key
    ```

5. Start the backend server:

    ```bash
    npm run dev
    ```

    The server will run on `http://localhost:5000`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
