
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('is_admin')) {
      navigate('/admin/login');
      return;
    }
    const fetchClients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/admin/clients', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch clients.');
        }
        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [navigate]);

  const handleExport = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/admin/clients/export', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to export clients.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clients.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/clients/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Erreur suppression client');
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    navigate('/admin/login');
  };

  if (loading) return <div className="text-center">Chargement des clients...</div>;
  if (error) return <div className="alert alert-danger">Erreur : {error}</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin - Liste des clients</h1>
        <button onClick={handleLogout} className="btn btn-warning">Déconnexion</button>
      </div>
      <div className="mb-3">
        <button onClick={handleExport} className="btn btn-success">Exporter en Excel</button>
      </div>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Ville</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nom}</td>
              <td>{client.prenom}</td>
              <td>{client.email}</td>
              <td>{client.telephone}</td>
              <td>{client.ville}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(client.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
