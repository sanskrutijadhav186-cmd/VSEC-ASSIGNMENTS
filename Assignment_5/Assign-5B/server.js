const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

let students;

async function connectDB() {
    await client.connect();

    console.log("MongoDB connected");

    const db = client.db("college");

    students = db.collection("students");
}

connectDB();

app.get("/students", async (req, res) => {

    const data = await students.find().toArray();

    res.send(data);
});

app.post("/students", async (req, res) => {

    await students.insertOne(req.body);

    res.send("Student added successfully");
});

app.put("/students/:id", async (req, res) => {

    const id = req.params.id;

    await students.updateOne(
        { id: id },
        {
            $set: {
                name: req.body.name,
                marks: req.body.marks
            }
        }
    );

    res.send("Student updated successfully");
});

app.delete("/students/:id", async (req, res) => {

    const id = req.params.id;

    await students.deleteOne({ id: id });

    res.send("Student deleted successfully");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});