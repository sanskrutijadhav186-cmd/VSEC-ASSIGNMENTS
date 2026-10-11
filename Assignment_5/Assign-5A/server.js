const express = require("express");
const app = express();
app.use (express.json());

let students = [
    {
        id : 1,
        name : "sanskruti",
        marks : 98
    },
    {
        id : 2,
        name : "riva",
        marks : 71
    }
];

app.get("/students",(req,res) =>{
    res.send(students);
});




app.post("/students", (req, res) => {

    const student = {
        id: students.length + 1,
        name: req.body.name,
        marks: req.body.marks
    };

    students.push(student);

    res.send("Student added successfully");
});

app.put("/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (student) {

        student.name = req.body.name;
        student.marks = req.body.marks;

        res.send("Student updated successfully");

    } else {

        res.send("Student not found");

    }
});

app.delete("/students/:id", (req, res) => {

    const id = Number(req.params.id);

    students = students.filter(s => s.id !== id);

    res.send("Student deleted successfully");
});

app.listen(3000,() => {
    console.log("server is running on port 3000");
});
