import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import type { UserTypes } from './types/UserTypes';

function App() {


  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<UserTypes[]>([]);

    console.log(message);

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users');
      setUsers(response.data);
      console.log(response.data);
      setMessage('Users loaded successfully!');

    } catch (error) {
      console.log("User loading error", error);
    }
  };

  const [editUser, setEditUser] = useState<UserTypes | null>(null);

  const editUsers = (user: UserTypes) => {
    setEditUser(user);
    setName(user.name);
    setAge(Number(user.age));
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/users/${editUser?.id}`, {
        name: name,
        age: age
      });
      setMessage('User updated successfully!');

    } catch (error) {
      console.log("User update error", error);
    }

    loadUsers();
    setAge(0);
    setName("");
  };


  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/users/${id}`);



      alert('User deleted successfully!');
    } catch (error) {
      console.log("User delete error", error);
    }

    loadUsers();
  };


  useEffect(() => {
    loadUsers();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/users', {
        name: name,
        age: age
      });

      setMessage('User created successfully!');
      setName('');
      setAge(0);
      loadUsers();
      console.log(response.data);
    } catch (error: any) {
      if (error.response) {
        setMessage(`Error: ${error.response.data}`);
      } else {
        setMessage('Failed to connect to server');
      }
    }
  };







  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4  rounded-lg">
      <form

        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">User Form</h2>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          onClick={editUser ? handleUpdate : handleSubmit}
        >
          {editUser ? 'Update User' : 'Create User'}
        </button>
      </form>

      <div className='flex flex-row items-center justify-center mt-8 w-full max-w-2xl'>
        <table>
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Status</th>

            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.age}</td>

                <td className='px-6'>
                  <button className='px-6 py-1 mx-3 bg-green-600 rounded-md hover:bg-green-700' onClick={() => editUsers(user)}>Edit</button>
                  <button className='px-6 py-1 mx-3 bg-red-600 rounded-md hover:bg-red-700' onClick={() => deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>



  )
}

export default App
