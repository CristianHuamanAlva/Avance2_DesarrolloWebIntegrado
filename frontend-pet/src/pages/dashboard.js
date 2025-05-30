import React, { useCallback, useEffect, useState } from 'react';
import UserTable from '../componentes/UserTable';
import OwnerTable from '../componentes/OwnerTable';
import PetTable from '../componentes/PetTable';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import {
  FaUser, FaPaw, FaUsersCog, FaSignOutAlt, FaSearch,
  FaUserMd, FaUserNurse
} from 'react-icons/fa';
import RegistroVeterinario from './registroVeterinario';
import RegistroAsistente from './registroAsistente';

const USER_API = 'http://localhost:8090/bd_petcare/api/users';
const OWNER_API = 'http://localhost:8090/bd_petcare/api/owners';
const PET_API = 'http://localhost:8090/bd_petcare/api/pets';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [section, setSection] = useState('r_vets');
  const [showActions, setShowActions] = useState(false);
  const [availableSpecies, setAvailableSpecies] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('duenio');

  const navigate = useNavigate();

  const fetchAll = useCallback(() => {
    fetchUsers();
    fetchOwners();
    fetchPets();
  }, []);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      navigate("/login");
    }
    fetchAll();
  }, [fetchAll, navigate]);

  useEffect(() => {
    if (['users', 'owners', 'pets'].includes(section)) {
      setInputValue('');
      setSearchTerm('');
      // Filtro por rol/especie también se reinicia
      if (section === 'users') {
        setSelectedRole('duenio');
      } else if (section === 'pets') {
        setSelectedRole('');
      } else {
        setSelectedRole('');
      }
    }
  }, [section]);


  const fetchUsers = () => {
    fetch(`${USER_API}/all`)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error('Error cargando usuarios:', err));
  };

  const fetchOwners = () => {
    fetch(`${OWNER_API}/all`)
      .then(res => res.json())
      .then(setOwners)
      .catch(err => console.error('Error cargando dueños:', err));
  };

  const fetchPets = () => {
    fetch(`${PET_API}/all`)
      .then(res => res.json())
      .then(data => {
        setPets(data);

        // Extraer especies únicas dinámicamente
        const especiesUnicas = Array.from(
          new Set(data.map(pet => pet.species?.toLowerCase()))
        );
        setAvailableSpecies(especiesUnicas);
      })
      .catch(err => console.error('Error cargando mascotas:', err));
  };


  const handleUserDelete = (id) => {
    fetch(`${USER_API}/delete/${id}`, { method: 'DELETE' })
      .then(fetchAll)
      .catch(err => console.error('Error al eliminar usuario:', err));
  };

  const handleUserUpdate = (user) => {
    fetch(`${USER_API}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(fetchUsers)
      .catch(err => console.error('Error al actualizar usuario:', err));
  };

  const handleOwnerUpdate = (owner) => {
    fetch(`${OWNER_API}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(owner)
    })
      .then(fetchOwners)
      .catch(err => console.error('Error al actualizar dueño:', err));
  };

  const handlePetDelete = (id) => {
    fetch(`${PET_API}/delete/${id}`, { method: 'DELETE' })
      .then(fetchPets)
      .catch(err => console.error('Error al eliminar mascota:', err));
  };

  const handlePetUpdate = (pet) => {
    fetch(`${PET_API}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet)
    })
      .then(fetchPets)
      .catch(err => console.error('Error al actualizar mascota:', err));
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate("/login");
  };

  const filterUsers = (data) => {
    return data.filter(item => {
      const matchSearch =
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.phone && item.phone.includes(searchTerm)) ||
        (item.role && item.role.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRole = !selectedRole || (item.role && item.role === selectedRole);
      return matchSearch && matchRole;
    });
  };

  const filterOwners = (data) => {
    return data.filter(item => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (item.phone && item.phone.includes(term)) || (item.address && item.address.toLowerCase().includes(term));
    });
  };

  // Para mascotas, filtro más completo (nombre, fecha, raza) + filtro especie (selectedRole aquí será especie)
  const filterPets = (data) => {
    return data.filter(item => {
      const matchSearch =
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.birthDate && item.birthDate.includes(searchTerm)) ||
        (item.breed && item.breed.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSpecies = !selectedRole || (item.species && item.species === selectedRole);

      return matchSearch && matchSpecies;
    });
  };


  const handleSearchClick = () => {
    setSearchTerm(inputValue.trim());
  };

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1><FaUsersCog /> PetCare / Panel de Control</h1>
        <div className="user-info">
          <FaUser />
          <span>Hola, {usuario?.name}</span>
          <div className="acciones-wrapper">
            <button onClick={() => setShowActions(prev => !prev)}>
              <FaSignOutAlt /> Acciones
            </button>
            {showActions && (
              <div className="acciones-menu">
                <button onClick={() => navigate("/")}>Inicio</button>
                <button onClick={cerrarSesion}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          <button className={section === 'r_vets' ? 'active' : ''} onClick={() => setSection('r_vets')}>
            <FaUserMd /> Registrar Veterinarios
          </button>
          <button className={section === 'r_asists' ? 'active' : ''} onClick={() => setSection('r_asists')}>
            <FaUserNurse /> Registrar Asistentes
          </button>
          <button className={section === 'users' ? 'active' : ''} onClick={() => setSection('users')}>
            <FaUsersCog /> Usuarios
          </button>
          <button className={section === 'owners' ? 'active' : ''} onClick={() => setSection('owners')}>
            <FaUser /> Dueños
          </button>
          <button className={section === 'pets' ? 'active' : ''} onClick={() => setSection('pets')}>
            <FaPaw /> Mascotas
          </button>
        </aside>

        <main className="dashboard-content">
          <div className="search-wrapper">
            {/* Mostrar buscador sólo en secciones users, owners y pets */}
            {(section === 'users' || section === 'owners' || section === 'pets') && (
              <>
                <button className="search-btn" onClick={handleSearchClick} aria-label="Buscar">
                  <FaSearch />
                </button>

                {/* Cambiar placeholder según sección */}
                <input
                  type="text"
                  placeholder={
                    section === 'owners'
                      ? "Ingresa el teléfono o dirección"
                      : section === 'pets'
                        ? "Buscar por nombre, fecha o raza"
                        : "Buscar por nombre o dato que necesites"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleEnterKey}
                  className="search-input"
                />

                {/* Filtros condicionales */}
                {section === 'users' && (
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="role-filter"
                  >
                    <option value="">Todos los roles</option>
                    <option value="duenio">Dueño</option>
                    <option value="asistente">Asistente</option>
                    <option value="veterinario">Veterinario</option>
                  </select>
                )}

                {section === 'pets' && (
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="role-filter"
                  >
                    <option value="">Todas las especies</option>
                    {availableSpecies.map(species => (
                      <option key={species} value={species}>
                        {species.charAt(0).toUpperCase() + species.slice(1)}
                      </option>
                    ))}
                  </select>
                )}


              </>
            )}
          </div>

          {section === 'users' && (
            <>
              <h2>Gestión de Usuarios</h2>
              <UserTable
                users={filterUsers(users)}
                onDelete={handleUserDelete}
                onUpdate={handleUserUpdate}
                owners={owners}
                pets={pets}
              />
            </>
          )}

          {section === 'r_vets' && <RegistroVeterinario onUserCreated={fetchUsers} />}
          {section === 'r_asists' && <RegistroAsistente onUserCreated={fetchUsers} />}

          {section === 'owners' && (
            <>
              <h2>Gestión de Dueños</h2>
              <OwnerTable
                owners={filterOwners(owners)}
                onUpdate={handleOwnerUpdate}
              />
            </>
          )}

          {section === 'pets' && (
            <>
              <h2>Gestión de Mascotas</h2>
              <PetTable
                pets={filterPets(pets)}
                onUpdate={handlePetUpdate}
                onDelete={handlePetDelete}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
