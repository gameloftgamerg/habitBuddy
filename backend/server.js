require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 2000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection URI
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET; // Change for production

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("habit-tracker");
    const habitsCollection = db.collection("habits");
    const usersCollection = db.collection("users");

    // User Registration
    app.post('/register', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required.' });
      } 
      if (await usersCollection.findOne({username})) {
        return res.status(400).send({ error: 'User already exists. Try logging in.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { username, password: hashedPassword };
      await usersCollection.insertOne(user);
      res.status(201).send({ message: 'User registered successfully.' });
    });

    // User Login
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      const user = await usersCollection.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send({ error: 'Invalid username or password' });
      }
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.send({ token });
    });


    // Middleware to verify JWT
    const authenticateJWT = (req, res, next) => {
      const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
      if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }
          req.user = user;
          next();
        });
      } else {
        res.sendStatus(401);
      }
    };

    // Habit routes now require authentication
    app.post('/habits', authenticateJWT, async (req, res) => {
      try {
        const { name } = req.body;
        if (!name) {
          return res.status(400).send({ error: 'Habit name is required' });
        }
        const habit = { name, completedDates: [], userId: req.user.id };
        const result = await habitsCollection.insertOne(habit);
        res.status(201).send(result.ops[0]);
      } catch (err) {
        res.status(500).send({ error: 'Failed to create habit', details: err.message });
      }
    });

    // Fetch habits for logged-in user
    app.get('/habits', authenticateJWT, async (req, res) => {
      try {
        const habits = await habitsCollection.find({ userId: req.user.id }).toArray();
        res.status(200).send(habits);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch habits', details: err.message });
      }
    });

    // Other habit routes...

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Run the MongoDB client and the server
run().catch(console.dir);
