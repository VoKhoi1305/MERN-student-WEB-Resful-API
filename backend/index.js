import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Student from './Student.js'; 

const app = express();
app.use(cors());
app.use(express.json());

// bài 1
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));


app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// bài 2 

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


// bài 3
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedStudent) {
      return res.status(404).json({ error: "Không tìm thấy học sinh" });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//bài 4
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Không tìm thấy học sinh để xóa" });
    }
    
    res.json({ message: "Đã xóa thành công", id: deletedStudent._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5200;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});