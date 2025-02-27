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
    NODE_ENV

  PORT=5000
  DATABASE_URL=your_database_url
  BCRYPT_SALT_ROUND=your_bcrypt_salt_round
  JWT_ACCESS_SECRET=your_jwt_access_secret
  JWT_REFRESH_SECRET=your_jwt_refresh_secret
  JWT_ACCESS_EXPIRES_IN=your_jwt_access_expires_in
  JWT_REFRESH_EXPIRES_IN=your_jwt_refresh_expires_in
  SP_ENDPOINT=your_sp_endpoint
  SP_USERNAME=your_sp_username
  SP_PASSWORD=your_sp_password
  SP_PREFIX=your_sp_prefix
  SP_RETURN_URL=your_sp_return_url

    ```

5. Start the backend server:

    ```bash
    npm run dev
    ```

    The server will run on `http://localhost:5000`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
