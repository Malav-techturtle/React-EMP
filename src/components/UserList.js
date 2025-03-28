import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditUser  from './EditUser '; // Assuming you have an EditUser  component

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [editingUser , setEditingUser ] = useState(null);
  const [error, setError] = useState('');

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
    }
  };

  // Delete a user by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      fetchUsers(); // Refresh the user list after deletion
    } catch (err) {
      setError('Failed to delete user. Please try again later.');
    }
  };

  // Effect to fetch users when the component mounts or page changes
  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>User List</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {editingUser  ? (
        <EditUser  user={editingUser } onUpdate={() => { setEditingUser (null); fetchUsers(); }} />
      ) : (
        <div>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <img src={user.avatar} alt={user.first_name} style={{ width: '50px', borderRadius: '50%' }} />
                <h3>{user.first_name} {user.last_name}</h3>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
                <button onClick={() => setEditingUser (user)}>Edit</button>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;