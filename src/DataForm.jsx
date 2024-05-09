import { useEffect, useState } from "react";
import axios from 'axios';

function DataForm() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    axios.get('https://phenomenal-sorbet-feffd8.netlify.app/.netlify/functions/api')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError('Error occurred while fetching data: ' + error.message);
      });
  }, []);

  const handleSubmit = async (e, id = null) => {
    e.preventDefault();

    if (!name || !age) {
      setError('Name and age cannot be empty! ');
      return;
    }

    const url = editItem
      ? `https://phenomenal-sorbet-feffd8.netlify.app/.netlify/functions/api/${editItem._id}`
      : 'https://phenomenal-sorbet-feffd8.netlify.app/.netlify/functions/api';
    const method = editItem ? 'put' : 'post';

    try {
      const response = await axios[method](url, { name, age });

      if (editItem) {
        setData(data.map((item) => (item._id === id ? { ...item, ...response.data } : item)));
      } else {
        setData([...data, response.data]);
      }

      setName('');
      setAge('');
      setEditItem(null);
      setError(null);
    } catch (error) {
      setError('Error occurred while submitting data: ' + error.message);
    }
  };

  const handleEdit = (_id) => {
    const itemToEdit = data.find((item) => item._id === _id);
    setEditItem(itemToEdit);
    setName(itemToEdit.name);
    setAge(itemToEdit.age);
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`https://phenomenal-sorbet-feffd8.netlify.app/.netlify/functions/api/${_id}`);
      setData(data.filter((item) => item._id !== _id));
    } catch (error) {
      console.log('Error occurred while deleting data:', error.message);
    }
  };

  return (
    <div className="data-container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="input-field"
        />
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="input-field"
        />
        <button type="submit" className="submit-btn">
          {editItem ? 'Update Data' : 'Add Data'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

     
      {data.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Buttons</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>
                  <button onClick={() => handleEdit(item._id)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataForm
