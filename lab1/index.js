const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let students = [{id: 1, name: 'Alex Gaita', faculty: 'AC', year: 4}];
let id = 1;

app.post('/students', (req, res) => {
    id = id + 1;
    const newStudent = {...req.body, id: id};
    students.push(newStudent);
    res.status(201).json(newStudent);
});

app.get('/students', (req, res) => {
    res.json(students);
});

app.get('/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find((s) => s.id === studentId);

    if (!student) {
        res.status(404).json({error: 'Student not found'});
    } else {
        res.json(student);
    }
});

app.put('/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const updatedStudent = req.body;

    students = students.map((student) => {
        if (student.id === studentId) {
            return {...student, ...updatedStudent};
        }
        return student;
    });

    res.json(updatedStudent);
});

app.delete('/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    students = students.filter((student) => student.id !== studentId);
    res.json({message: 'Student deleted successfully'});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
