import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  
  // State cho Form (Bài 2 & 3)
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  const [editingId, setEditingId] = useState(null);

  // State cho Tìm kiếm (Bài 5)
  const [searchTerm, setSearchTerm] = useState("");

  // State cho Sắp xếp (BÀI 6 - MỚI)
  const [sortAsc, setSortAsc] = useState(true);

  const API_URL = 'http://localhost:5200/api/students';

  // BÀI 1: LẤY DANH SÁCH
  useEffect(() => {
    axios.get(API_URL)
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  }, []);

  // BÀI 5: LOGIC LỌC 
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // BÀI 6: LOGIC SẮP XẾP 

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortAsc) {
      return a.name.localeCompare(b.name); // A -> Z
    } else {
      return b.name.localeCompare(a.name); // Z -> A
    }
  });

  // BÀI 2 & 3: XỬ LÝ THÊM & SỬA
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { name, age: Number(age), class: stuClass };

    if (editingId) {
      axios.put(`${API_URL}/${editingId}`, formData)
        .then(res => {
          setStudents(prev => prev.map(stu => 
            stu._id === editingId ? res.data : stu
          ));
          resetForm();
        })
        .catch(err => console.error("Lỗi khi sửa:", err));
    } else {
      axios.post(API_URL, formData)
        .then(res => {
          setStudents(prev => [...prev, res.data]);
          resetForm();
        })
        .catch(err => console.error("Lỗi khi thêm:", err));
    }
  };

  // BÀI 4: XỬ LÝ XÓA
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa học sinh này không?")) {
      axios.delete(`${API_URL}/${id}`)
        .then(res => {
          setStudents(prev => prev.filter(stu => stu._id !== id));
          if (editingId === id) resetForm();
        })
        .catch(err => console.error("Lỗi khi xóa:", err));
    }
  };

  const handleEditClick = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setAge(student.age);
    setStuClass(student.class);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setAge("");
    setStuClass("");
  };

  return (
    <div className="App">
      <div className="header-container">
        <h1>Quản Lý Lớp Học</h1>
      </div>

      <div className="form-card">
        <h3>{editingId ? "Chỉnh Sửa Hồ Sơ" : "Hồ Sơ Học Sinh Mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" placeholder="Họ và tên..." value={name} onChange={e => setName(e.target.value)} required />
            <input type="number" placeholder="Tuổi..." value={age} onChange={e => setAge(e.target.value)} required style={{ maxWidth: "100px" }} />
            <input type="text" placeholder="Lớp..." value={stuClass} onChange={e => setStuClass(e.target.value)} required style={{ maxWidth: "150px" }} />
          </div>
          <div style={{ marginTop: "15px", textAlign: "right" }}>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ backgroundColor: "#aaa", marginRight: "10px" }}>Hủy bỏ</button>
            )}
            <button type="submit">{editingId ? "Cập Nhật" : "Lưu Hồ Sơ"}</button>
          </div>
        </form>
      </div>

      {/* THANH CÔNG CỤ: TÌM KIẾM & SẮP XẾP (BÀI 5 & 6) */}
      <div style={{ marginBottom: "15px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
        
        {/* BÀI 6: NÚT SẮP XẾP */}
        <button 
          onClick={() => setSortAsc(!sortAsc)}
          style={{ 
            height: "40px", 
            backgroundColor: "#fff", 
            color: "#5d4037", 
            border: "2px solid #5d4037",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          {sortAsc ? "Sắp xếp: A ⮕ Z ⬇" : "Sắp xếp: Z ⮕ A ⬆"}
        </button>

        {/* BÀI 5: Ô TÌM KIẾM */}
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ 
            padding: "10px", 
            width: "250px", 
            border: "2px solid #5d4037", 
            borderRadius: "6px",
            outline: "none",
            height: "16px"
          }}
        />
      </div>

        {/* BÀI 1+5+6: BẢNG HIỂN THỊ DANH SÁCH */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ cursor: "pointer" }} onClick={() => setSortAsc(!sortAsc)}>
                Họ Tên {sortAsc ? "▼" : "▲"}
              </th>
              <th>Tuổi</th>
              <th>Lớp</th>
              <th style={{ width: "140px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                {searchTerm ? "Không tìm thấy kết quả phù hợp." : "Danh sách trống."}
              </td></tr>
            ) : (
              sortedStudents.map((stu) => (
                <tr key={stu._id}>
                  <td style={{ fontWeight: "500" }}>{stu.name}</td>
                  <td>{stu.age}</td>
                  <td><span style={{ backgroundColor: "#d7ccc8", padding: "4px 8px", borderRadius: "4px", fontSize: "0.9em" }}>{stu.class}</span></td>
                  <td>
                    <button 
                      onClick={() => handleEditClick(stu)}
                      style={{ padding: "5px 10px", fontSize: "12px", backgroundColor: "#8d6e63", marginRight: "8px" }}
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(stu._id)}
                      style={{ padding: "5px 10px", fontSize: "12px", backgroundColor: "#c62828" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;