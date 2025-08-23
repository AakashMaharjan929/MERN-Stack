import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', image: null });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.image) data.append("image", formData.image);

    if (editId) {   
      await axios.put(`${API_URL}/${editId}`, data);
      setEditId(null);
    } else {
      await axios.post(API_URL, data);
    }

    const response = await axios.get(API_URL);
    setUsers(response.data);
    setFormData({ username: '', email: '', password: '', image: null });
  };

  const handleEdit = (user) => {
    setFormData({ username: user.username, email: user.email, password: '', image: null });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    const response = await axios.get(API_URL);
    setUsers(response.data);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User CRUD App</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input style={styles.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input style={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input style={styles.input} type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit" style={styles.submitBtn}>{editId ? 'Update' : 'Create'}</button>
      </form>

      <div style={styles.usersContainer}>
        {users.map(user => (
          <div key={user._id} style={styles.card}>
            <h3 style={styles.username}>{user.username}</h3>
            <p style={styles.email}>{user.email}</p>
            {user.image && <img src={`http://localhost:4000/uploads/${user.image}`} alt={user.username} style={styles.image} />}
            <div style={styles.buttonContainer}>
              <button onClick={() => handleEdit(user)} style={styles.editBtn}>Edit</button>
              <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

// Inline styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
    background: '#f0f2f5',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '10px',
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '0 auto 30px auto',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  submitBtn: {
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    background: '#4CAF50',
    color: '#fff',
    cursor: 'pointer',
    transition: '0.3s',
  },
  usersContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    background: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  username: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '5px',
  },
  email: {
    fontSize: '0.95rem',
    color: '#666',
    marginBottom: '10px',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  editBtn: {
    padding: '6px 12px',
    background: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 12px',
    background: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
