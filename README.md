# Book Shop API

## Overview
The **Book Shop API** is an Express-based backend application developed with TypeScript and MongoDB (using Mongoose). This application allows users to manage books and orders in a book store while ensuring data integrity and providing meaningful error responses.

---

## Features

### Books
1. **Create a Book**: Add a new book with title, author, price, category, description, quantity, and stock status.
2. **Retrieve All Books**: Get a list of all books with optional search filters by title, author, or category.
3. **Retrieve Specific Book**: Fetch detailed information about a specific book by its ID.
4. **Update Book Details**: Update price, quantity, or other details of an existing book.
5. **Delete a Book**: Remove a book from the inventory.

### Orders
1. **Create an Order**: Place an order for a book, reducing the book's stock quantity.
2. **Revenue Calculation**: Aggregate and calculate total revenue from all orders.

### Error Handling
- Comprehensive error responses for validation failures, missing resources, and insufficient stock.

---

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Framework for building web applications and APIs.
- **TypeScript**: Enhances JavaScript with static typing.
- **MongoDB**: NoSQL database for storing books and orders.
- **Mongoose**: ODM for MongoDB to define schemas and manage data.
- **Postman**: For API testing and documentation.

---



### Books

### Create a Book
- **Endpoint:** `POST /api/products`
- **Request Body:**
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 10,
    "category": "Fiction",
    "description": "A story about the American dream.",
    "quantity": 100,
    "inStock": true
  }
  ```
- **Response:** Success message and created book details.

```jsx
{
  "message": "Book created successfully",
  "success": true,
  "data": {
    "_id": "648a45e5f0123c45678d9012",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 10,
    "category": "Fiction",
    "description": "A story about the American dream.",
    "quantity": 100,
    "inStock": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z",
  }
}
```

---

### **2. Get All Books**

- **Endpoint:** **`/api/products`**
- **Method:** `GET`
- **Response:** A list of all books with details like name, author, price, category, etc.
- Query: A list of all books from the same category, you’ll take this as `/api/products?searchTerm=category` searchTerm can be `title, author, category`

```jsx
{
  "message": "Books retrieved successfully",
  "status": true,
  "data": [
    {
      "_id": "648a45e5f0123c45678d9012",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "price": 10,
      "category": "Fiction",
      "description": "A story about the American dream.",
      "quantity": 100,
      "inStock": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z",
    },
    // ... rest data
  ]
}
```

---

### **3. Get a Specific Book**

- **Endpoint:** **`/api/products/:productId`**
- **Method:** `GET`
- **Response:** The details of a specific book by ID.

```jsx
{
  "message": "Book retrieved successfully",
  "status": true,
  "data": {
    "_id": "648a45e5f0123c45678d9012",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 10,
    "category": "Fiction",
    "description": "A story about the American dream.",
    "quantity": 100,
    "inStock": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z",
  }
}
```

---

### **4. Update a Book**

- **Endpoint:** **`/api/products/:productId`**
- **Method:** `PUT`
- **Request Body:** (Book details to update)

```json
{
  "price": 15,
  "quantity": 25,
}
```

- **Response:** Success message and updated book details.

```jsx
{
  "message": "Book updated successfully",
  "status": true,
  "data": {
    "_id": "648a45e5f0123c45678d9012",
    "name": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 15,  // Price updated
    "category": "Fiction",
    "description": "A story about the American dream.",
    "quantity": 25,  // Quantity updated
    "inStock": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T11:00:00.000Z",  // Updated timestamp
  }
}
```

---

### **5. Delete a Book**

- **Endpoint:** **`/api/products/:productId`**
- **Method:** `DELETE`
- **Response:** Success message confirming the book has been deleted.

```jsx
{
  "message": "Book deleted successfully",
  "status": true,
  "data": {}
}
```

---

### **6. Order a Book**

- **Endpoint:** **`/api/orders`**
- **Method:** `POST`
- **Inventory Management Logic:**
  - When an order is placed, reduce the **quantity** in the product model.
  - If the inventory quantity goes to zero, set **inStock** to `false`.
  - Handle **insufficient stock** cases by returning an appropriate error message.
- **Request Body:**

```json
{
  "email": "customer@example.com",
  "product": "648a45e5f0123c45678d9012",
  "quantity": 2,
  "totalPrice": 30
}
```

- **Response:** Success message confirming the order.

```jsx
{
  "message": "Order created successfully",
  "status": true,
  "data": {
    "_id": "648b45f5e1234b56789a6789",
    "email": "customer@example.com",
    "product": "648a45e5f0123c45678d9012",
    "quantity": 2,
    "totalPrice": 30,
    "createdAt": "2024-11-19T12:00:00.000Z",
    "updatedAt": "2024-11-19T12:00:00.000Z",
  }
}
```

---

### **7. Calculate Revenue from Orders (Aggregation)**

- **Endpoint:** **`/api/orders/revenue`**
- **Method:** `GET`
- **Aggregation Suggestion:**
  - Use MongoDB aggregation pipeline to calculate the total revenue from `all orders`.
  - Calculate the total price by multiplying the price of each book by the quantity ordered.
- **Response:** The total revenue from all orders.

```jsx
{
  "message": "Revenue calculated successfully",
  "status": true,
  "data": {
    "totalRevenue": 450  // Total revenue calculated from all orders
  }
}
```

---

## Setup Instructions

Follow the steps below to set up the Book Shop API project on your local machine:

### 1. Clone the Repository
Clone the project from GitHub to your local system using the following command:
```bash
git clone https://github.com/your-username/book-shop-api.git
cd book-shop-api
```

### 2. Install Dependencies
Run the following command to install all required dependencies:
```bash
npm install
```

### 3. Set Environment Variables
Create a `.env` file in the root directory of the project and add the following configuration:

```env

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/book-shop?retryWrites=true&w=majority

```
Replace `<username>` and `<password>` with your MongoDB credentials.


### 4. Start the Application
Use the command below to start the application in development mode:

```bash
npm run dev
```
The server will run at `http://localhost:5000` by default.

### 5. Test the API

- Use **Postman** or any API testing tool to interact with the API endpoints.
- Alternatively, you can use a browser to test GET endpoints.

## Available Script
- `npm run dev`: Starts the server in development mode with live reloading.
- `npm run build`: Builds the application for production.
- `npm start`: Runs the compiled production build.

## Requirements
Make sure the following software/tools are installed on your system:

- **Node.js**: Version 16 or higher.
- **npm**: Comes with Node.js.
- **MongoDB**: Either a local instance or a cloud instance (e.g., MongoDB Atlas).

## Live Link

- Deployed at: https://book-store-a2.vercel.app/

## Video Explanation

- Watch the explanation: https://drive.google.com/file/d/1cemgRNTeE-W6cfKlHNelWv0pl-y2FJEd/view?usp=sharing