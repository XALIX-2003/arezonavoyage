import React, { useState, useEffect, useCallback } from 'react';
import { getAdminClients, deleteClient, exportClients } from '../../api';

function ClientManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      const data = await getAdminClients();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
    const intervalId = setInterval(fetchClients, 10000);
    return () => clearInterval(intervalId);
  }, [fetchClients]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      await deleteClient(id);
      fetchClients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportClients();
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

  if (loading) return <div className="text-center">Chargement des clients...</div>;
  if (error) return <div className="alert alert-danger">Erreur : {error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Liste des clients</h1>
        <button className="btn btn-success" onClick={handleExport}>Exporter en Excel</button>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover bg-white shadow-sm rounded">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Destination</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map(client => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.nom}</td>
                  <td>{client.prenom}</td>
                  <td>{client.email}</td>
                  <td>{client.telephone}</td>
                  <td>{client.ville}</td>
                  <td>{client.destination || '-'}</td>
                  <td>{client.prix != null ? client.prix : '-'}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(client.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted">Aucun client pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientManager;
