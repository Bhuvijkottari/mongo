const{MongoClient,ServerApiVersion,ObjectId}=require('mongodb');
const express=require('express');
const app=express();
require('dotenv').config();


app.use(express.json());
const dbUrl= process.env.MONGO_URL;
const client = new MongoClient(dbUrl, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } } );
let registerCollection;
let eventsCollection;
async function connectDB() {
  try {
    await client.connect();
    db = client.db("synergia");
    eventsCollection = db.collection("events");
    registerCollection = db.collection("registrations");

    console.log("Connected to MongoDB successfully!");


    const eventCount = await eventsCollection.countDocuments();
    if (eventCount === 0) {
      await eventsCollection.insertMany([
        { id: 1, title: "Dance Festival", desc: "An event showcasing your dance skills.", date: "2025-11-15", image: "dance.jpg", capacity: 100 },
        { id: 2, title: "Hackverse", desc: "A 24-hour hackathon full of innovation.", date: "2025-11-16", image: "hackathon.jpg", capacity: 150 },
        { id: 3, title: "Treasure Hunt", desc: "A thrilling hunt for hidden treasures!", date: "2025-11-17", image: "hunt.jpg", capacity: 100 },
        { id: 4, title: "Art Exhibition", desc: "Showcasing modern art from local artists.", date: "2025-11-18", image: "art.jpg", capacity: 150 },
        { id: 5, title: "Music Concert", desc: "An evening of classical music performances.", date: "2025-11-19", image: "concert.jpg", capacity: 75 },
      ]);
      console.log("events added to database.");
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
connectDB();

app.post('/events', async (request, response) => {
  try {
    const { id, title, desc, date, image, capacity } = request.body;
    await eventsCollection.insertOne({ id, title, desc, date, image, capacity });
    response.send("Event added successfully");
  } catch (error) {
    console.error(error);
    response.send("Error adding event");
  }
});

  app.delete('/events/:id', async (request, response) => {
  const id = parseInt(request.params.id);
  const result = await eventsCollection.deleteOne({ id });
  if (result.deletedCount === 0) return response.send("Event not found");
  response.send("Event deleted");
});



app.get('/events', async (request, response) => {
  const events = await eventsCollection.find().toArray();
  response.json(events);
});

app.put('/events/:id', async (request, response) => {
  const id = parseInt(request.params.id);
  const update = request.body;
  const result = await eventsCollection.updateOne({ id }, { $set: update });
  if (result.matchedCount === 0) return res.send("Event not found");
  response.send("Event updated");
});
app.get('/events/filter', async (request, response) => {
  const { event } = request.query;
  const bookings = await registerCollection.find({ event }).toArray();
  if (bookings.length === 0) return response.send("No bookings found for this event");
  response.json(bookings);
});



app.get('/register', async (request, response) => {
  const registrations = await registerCollection.find().toArray();
  response.json(registrations);
});
app.get('/register/search', async (request, response) => {
  const { email } = request.query;
  const bookings = await registerCollection.find({ email }).toArray();
  if (bookings.length === 0) return response.send("No bookings found");
  response.json(bookings);
});

app.get('/register/:id', async (request, response) => {
  const id = request.params.id;
  const user = await registerCollection.findOne({  _id: new ObjectId(id)  });
  if (!user) return response.send("User not found");
  response.json(user);
});

app.put('/register/:id', async (request, response) => {
  const id = request.params.id;
  const update = request.body;
  const result = await registerCollection.updateOne({ _id: new ObjectId(id)  }, { $set: update });
  if (result.matchedCount === 0) return response.send("User not found");
  response.send("Registration updated");
});


app.delete('/register/:id', async (request, response) => {
  const id = request.params.id;
  const result = await registerCollection.deleteOne({ _id: new ObjectId(id)  });
  if (result.deletedCount === 0) return response.status(404).send("User not found");
  response.send("Registration deleted");
});

app.post('/register', async (request, response) => {
  const { name, email, event,ticketType } = request.body;

  try {
    if (!name || !email || !event) {
  return response.send("Missing required fields");
}

    
    if (!email.endsWith("@sahyadri.edu.in")) {
      return response.send("Only sahyadri.edu.in emails allowed");
    }

    const selectedEvent = await eventsCollection.findOne({ title: event });
    if (!selectedEvent) {
      return response.send("Event not found");
    }

    
    const registeredCount = await registerCollection.countDocuments({ event });
    if (registeredCount >= selectedEvent.capacity) {
      return response.send("Event capacity full");
    }
    const newBooking = {
      name,
      email,
      event,
      ticketType: ticketType || "General",
      createdAt: new Date(),
    };

    
    await registerCollection.insertOne(newBooking );
    response.send("Successfully registered!");
  } catch (err) {
    console.error(err);
    response.send("Error during registration");
  }
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});