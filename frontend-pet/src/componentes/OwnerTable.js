import React, { useState } from 'react';

function OwnerTable({ owners, onUpdate }) {
  const [editOwnerId, setEditOwnerId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEditClick = (owner) => {
    setEditOwnerId(owner.ownerId);
    setFormData({ ...owner });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
    setEditOwnerId(null);
  };

  const handleCancel = () => {
    setEditOwnerId(null);
    setFormData({});
  };

  return (
    <table  className="dashboard-table">
      <thead>
        <tr>
          <th>ID</th><th>Teléfono</th><th>Dirección</th><th>ID Usuario</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {owners.map(owner => (
          editOwnerId === owner.ownerId ? (
            <tr key={owner.ownerId}>
              <td>{owner.ownerId}</td>
              <td><input name="phone" value={formData.phone || ''} onChange={handleChange} /></td>
              <td><input name="address" value={formData.address || ''} onChange={handleChange} /></td>
              <td>{owner.user?.userId || ''}</td>
              <td>
                <button onClick={handleSubmit}>Guardar</button>
                <button onClick={handleCancel}>Cancelar</button>
              </td>
            </tr>
          ) : (
            <tr key={owner.ownerId}>
              <td>{owner.ownerId}</td>
              <td>{owner.phone}</td>
              <td>{owner.address}</td>
              <td>{owner.user?.userId}</td>
              <td>
                <button onClick={() => handleEditClick(owner)}>Editar</button>
              </td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
}

export default OwnerTable;
