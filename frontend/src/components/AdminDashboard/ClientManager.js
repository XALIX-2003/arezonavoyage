import React, { useState, useEffect, useCallback } from 'react';

function ClientManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setError("Utilisateur non authentifié. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/clients?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch clients.');
      }

      const data = await response.json();
      setClients(data);
    } catch (err) {
      if (!(err instanceof TypeError)) {
        setError(err.message);
      }
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  }, [loading]);

  useEffect(() => {
    // Lance la récupération initiale
    fetchClients();

    // Met en place un intervalle pour rafraîchir toutes les 10 secondes
    const intervalId = setInterval(fetchClients, 10000);

    // Nettoie l'intervalle quand le composant est démonté pour éviter les fuites de mémoire
    return () => clearInterval(intervalId);
  }, [fetchClients]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;

    const username = localStorage.getItem('username');
    if (!username) {
      setError("Erreur : nom d'utilisateur introuvable. Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/clients/${id}?username=${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Erreur suppression client');
      fetchClients();
    } catch (err) {
      setError(err.message);
    }
  };

  // Ajout export Excel avec username
  const handleExport = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setError("Erreur : nom d'utilisateur introuvable. Veuillez vous reconnecter.");
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/clients/export?username=${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Erreur export clients');
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

  if (loading) return <div className="text-center">Chargement des clients...</div>;
  if (error) return <div className="alert alert-danger">Erreur : {error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Liste des clients</h1>
        <button className="btn btn-success" onClick={handleExport}>Exporter en Excel</button>
      </div>
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
          {clients.map(client => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientManager;