import React, { useState } from 'react';

function PetTable({ pets, onUpdate, onDelete }) {
  const [editPetId, setEditPetId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEditClick = (pet) => {
    setEditPetId(pet.petId);
    // clonar el objeto pet para edición
    setFormData({
      petId: pet.petId,
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      birthDate: pet.birthDate ? pet.birthDate.substring(0, 10) : '', // fecha en formato yyyy-mm-dd
      owner: pet.owner ? { ownerId: pet.owner.ownerId } : null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('owner.')) {
      // para editar campos del owner (si decides agregar)
      const ownerField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        owner: { ...prev.owner, [ownerField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onUpdate(formData);
    setEditPetId(null);
  };

  const handleCancel = () => {
    setEditPetId(null);
    setFormData({});
  };

  return (
    <table  className="dashboard-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Especie</th>
          <th>Raza</th>
          <th>Fecha Nacimiento</th>
          <th>ID Dueño</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pets.map(pet => (
          editPetId === pet.petId ? (
            <tr key={pet.petId}>
              <td>{pet.petId}</td>
              <td><input name="name" value={formData.name || ''} onChange={handleChange} /></td>
              <td><input name="species" value={formData.species || ''} onChange={handleChange} /></td>
              <td><input name="breed" value={formData.breed || ''} onChange={handleChange} /></td>
              <td><input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} /></td>
              <td>{pet.owner?.ownerId || ''}</td> {/* Por simplicidad no editable, pero puedes hacerlo */}
              <td>
                <button onClick={handleSubmit}>Guardar</button>
                <button onClick={handleCancel}>Cancelar</button>
              </td>
            </tr>
          ) : (
            <tr key={pet.petId}>
              <td>{pet.petId}</td>
              <td>{pet.name}</td>
              <td>{pet.species}</td>
              <td>{pet.breed}</td>
              <td>{pet.birthDate ? pet.birthDate.substring(0, 10) : ''}</td>
              <td>{pet.owner?.ownerId}</td>
              <td>
                <button onClick={() => handleEditClick(pet)}>Editar</button>
                <button onClick={() => onDelete(pet.petId)}>Eliminar</button>
              </td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
}

export default PetTable;
