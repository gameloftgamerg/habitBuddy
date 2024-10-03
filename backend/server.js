require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT;

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

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("habit-tracker");
    const habitsCollection = db.collection("habits");

    // Routes
    app.post('/habits', async (req, res) => {
      try {
        const { name } = req.body;
        const habit = { name, completedDates: [] };
        const result = await habitsCollection.insertOne(habit);
        res.status(201).send(result.ops[0]);
      } catch (err) {
        res.status(500).send({ error: 'Failed to create habit', details: err.message });
      }
    });

    app.post('/habits/:id/complete', async (req, res) => {
      const { id } = req.params;
      const date = new Date();
      try {
        await habitsCollection.updateOne(
          { _id: new MongoClient.ObjectId(id) },
          { $addToSet: { completedDates: date } }
        );
        res.status(200).send({ message: 'Habit marked as completed' });
      } catch (err) {
        res.status(500).send({ error: 'Failed to update habit', details: err.message });
      }
    });

    app.get('/habits', async (req, res) => {
      try {
        const habits = await habitsCollection.find().toArray();
        res.status(200).send(habits);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch habits', details: err.message });
      }
    });

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
