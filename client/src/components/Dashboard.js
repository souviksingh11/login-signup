import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingAuthor, setEditingAuthor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetch("/getauthors", {
        method: "GET",
        headers: { Authorization: token },
      })
        .then((res) => res.json())
        .then((data) => setAuthors(data))
        .catch((err) => console.error(err));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/authorcreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthors([...authors, data.newAuthor]);
        setForm({ name: "", description: "" });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating author:", error);
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setForm({ name: author.name, description: author.description });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingAuthor) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/updateauthor/${editingAuthor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthors(authors.map((a) => (a._id === editingAuthor._id ? data.author : a)));
        setEditingAuthor(null);
        setForm({ name: "", description: "" });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/deleteauthor/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (response.ok) {
        setAuthors(authors.filter((author) => author._id !== id));
      }
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Welcome to Your Dashboard</h1>

      <div className="card p-3 mb-4">
        <h3>{editingAuthor ? "Edit Author" : "Create Author"}</h3>
        <form onSubmit={editingAuthor ? handleUpdate : handleCreate}>
          <div className="mb-2">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Description:</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingAuthor ? "Update Author" : "Create Author"}
          </button>
          {editingAuthor && (
            <button className="btn btn-secondary ms-2" onClick={() => setEditingAuthor(null)}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {authors.length > 0 ? (
        <div>
          <h3>Author Profiles:</h3>
          <ul className="list-group">
            {authors.map((author) => (
              <li key={author._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{author.name}</h5>
                  <p>{author.description}</p>
                </div>
                <div>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(author)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(author._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center">No authors found.</p>
      )}
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
