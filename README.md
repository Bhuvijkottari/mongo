This project is a Node.js + Express REST API for managing Synergia event bookings, connected to MongoDB using the official MongoDB driver.
All CRUD operations are fully tested using Postman, and data is stored in MongoDB.
Dependencies are installed by npm install.
Created a file named .env in the project root to store the mongourl
Started the server by node server.js
Initialyy all events are added by testing in postman and stored in mongodb.
Later the bookings apis are tested in postman
| Method   | Endpoint                  | Description              |
| -------- | ------------------------- | ------------------------ |
| `GET`    | `/register`               | Get all bookings         |
| `POST`   | `/register`               | Create a new booking     |
| `GET`    | `/register/:id`           | Get booking by ID        |
| `PUT`    | `/register/:id`           | Update booking details   |
| `DELETE` | `/register/:id`           | Delete booking           |
| `GET`    | `/register/search?email=` | Search booking by email  |
| `GET`    | `/register/filter?event=` | Filter bookings by event 

Features
Connected to MongoDB using the official MongoDB Node.js driver
All data stored permanently (no in-memory array)
CRUD operations following REST API standards
Validations for name, email, and event
.env support using dotenv
All APIs tested successfully using Postman
