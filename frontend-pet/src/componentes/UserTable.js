import React, { useState } from 'react';

function UserTable({ users, onDelete, onUpdate, owners, pets }) {
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [expandedUserId, setExpandedUserId] = useState(null);

  const handleEditClick = (user) => {
    setEditUserId(user.userId);
    setFormData({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getPetIcon = (species) => {
    const icons = {
      perro: '🐶',
      gato: '🐱',
      ave: '🐦',
      conejo: '🐰',
      pez: '🐟'
    };
    return icons[species?.toLowerCase()] || '🐾';
  };


  const handleSubmit = () => {
    onUpdate(formData);
    setEditUserId(null);
  };

  const handleCancel = () => {
    setEditUserId(null);
    setFormData({});
  };

  const toggleExpand = (userId) => {
    setExpandedUserId(prev => (prev === userId ? null : userId));
  };

  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Email</th><th>Contraseña</th><th>Rol</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => {
          const owner = owners.find(o => o.user?.userId === user.userId);
          const userPets = owner ? pets.filter(p => p.owner?.ownerId === owner.ownerId) : [];

          return (
            <React.Fragment key={user.userId}>
              {editUserId === user.userId ? (
                <tr>
                  <td>{user.userId}</td>
                  <td><input name="name" value={formData.name || ''} onChange={handleChange} /></td>
                  <td><input name="email" value={formData.email || ''} onChange={handleChange} /></td>
                  <td><input name="password" value={formData.password || ''} onChange={handleChange} /></td>
                  <td>
                    <select name="role" value={formData.role || ''} onChange={handleChange}>
                      <option value="duenio">Dueño</option>
                      <option value="asistente">Asistente</option>
                      <option value="veterinario">Veterinario</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleSubmit}>Guardar</button>
                    <button onClick={handleCancel}>Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)}>Editar</button>
                    <button onClick={() => onDelete(user.userId)}>Eliminar</button>
                    <button className="details-button" onClick={() => toggleExpand(user.userId)}>
                      {expandedUserId === user.userId ? '👁️ Ocultar' : '👁️ Ver detalles'}
                    </button>

                  </td>
                </tr>
              )}
              {expandedUserId === user.userId && (
                <tr>
                  <td colSpan="6">
                    <div className="details-box">
                      <h4>🧑 Información del Dueño</h4>
                      <hr />
                      {owner ? (
                        <table className="owner-info-table">
                          <tbody>
                            <tr>
                              <td><strong>ID:</strong></td>
                              <td>{owner.ownerId}</td>
                            </tr>
                            <tr>
                              <td><strong>Teléfono:</strong></td>
                              <td>{owner.phone}</td>
                            </tr>
                            <tr>
                              <td><strong>Dirección:</strong></td>
                              <td>{owner.address}</td>
                            </tr>
                          </tbody>
                        </table>
                      ) : (
                        <p><em>No tiene dueño asociado.</em></p>
                      )}

                      <h4>🐾 Mascotas Registradas</h4>
                      <hr />
                      {userPets.length > 0 ? (
                        <ul className="pet-list">
                          {userPets.map(pet => (
                            <li key={pet.petId}>
                              {getPetIcon(pet.species)} <strong>{pet.name}</strong> — {pet.species} ({pet.breed})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p><em>No tiene mascotas registradas.</em></p>
                      )}
                    </div>
                  </td>
                </tr>
              )}


            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

export default UserTable;
