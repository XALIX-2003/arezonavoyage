
const API_URL = 'http://127.0.0.1:5000/api';

// --- Public Routes ---

export const getDestinations = async () => {
  const response = await fetch(`${API_URL}/destinations`);
  if (!response.ok) throw new Error('Failed to fetch destinations');
  return await response.json();
};

export const getDestinationDetails = async (id) => {
  const response = await fetch(`${API_URL}/destinations/${id}`);
  if (!response.ok) throw new Error('Failed to fetch destination details');
  return await response.json();
};

export const getProgrammes = async () => {
  const response = await fetch(`${API_URL}/programmes`);
  if (!response.ok) throw new Error('Failed to fetch programmes');
  return await response.json();
};

export const getProgrammeDetails = async (id) => {
  const response = await fetch(`${API_URL}/programmes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch programme details');
  return await response.json();
};

export const getHotels = async () => {
  const response = await fetch(`${API_URL}/hotels`);
  if (!response.ok) throw new Error('Failed to fetch hotels');
  return await response.json();
};

export const getHotelDetails = async (id) => {
  const response = await fetch(`${API_URL}/hotels/${id}`);
  if (!response.ok) throw new Error('Failed to fetch hotel details');
  return await response.json();
};

export const bookProgram = async (bookingData) => {
  const response = await fetch(`${API_URL}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error('Booking failed');
  return await response.json();
};

// --- Admin Routes ---

export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return await response.json();
};

export const getAdminClients = async () => {
    const response = await fetch(`${API_URL}/admin/clients`);
    if (!response.ok) throw new Error('Failed to fetch admin clients');
    return await response.json();
};

export const deleteClient = async (id) => {
    const response = await fetch(`${API_URL}/admin/clients/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete client');
    return await response.json();
};

export const exportClients = async () => {
    const response = await fetch(`${API_URL}/admin/clients/export`);
    if (!response.ok) throw new Error('Failed to export clients');
    return await response.blob();
};

export const getAdminDestinations = async () => {
  const response = await fetch(`${API_URL}/admin/destinations`);
  if (!response.ok) throw new Error('Failed to fetch admin destinations');
  return await response.json();
};

export const getAdminDestinationDetails = async (id) => {
    const response = await fetch(`${API_URL}/admin/destinations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch admin destination details');
    return await response.json();
};

export const createDestination = async (formData) => {
    const response = await fetch(`${API_URL}/admin/destinations`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to create destination');
    return await response.json();
};

export const updateDestination = async (id, data) => {
    const response = await fetch(`${API_URL}/admin/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update destination');
    return await response.json();
};

export const deleteDestination = async (id) => {
    const response = await fetch(`${API_URL}/admin/destinations/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete destination');
    return await response.json();
};

export const getImagesForDestination = async (id) => {
    const response = await fetch(`${API_URL}/admin/destinations/${id}/images`);
    if (!response.ok) throw new Error('Failed to fetch images for destination');
    return await response.json();
};

export const addImageToDestination = async (id, formData) => {
    const response = await fetch(`${API_URL}/admin/destinations/${id}/images`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to add image to destination');
    return await response.json();
};

export const deleteImage = async (id) => {
    const response = await fetch(`${API_URL}/admin/images/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete image');
    return await response.json();
};

export const getProgrammesForDestination = async (destinationId) => {
    const response = await fetch(`${API_URL}/admin/destinations/${destinationId}/programmes`);
    if (!response.ok) throw new Error('Failed to fetch programmes for destination');
    return await response.json();
};

export const getAdminProgrammes = async () => {
    const response = await fetch(`${API_URL}/admin/programmes`);
    if (!response.ok) throw new Error('Failed to fetch admin programmes');
    return await response.json();
};

export const createProgramme = async (programmeData) => {
    const response = await fetch(`${API_URL}/admin/programmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programmeData),
    });
    if (!response.ok) throw new Error('Failed to create programme');
    return await response.json();
};

export const updateProgramme = async (id, data) => {
    const response = await fetch(`${API_URL}/admin/programmes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update programme');
    return await response.json();
};

export const deleteProgramme = async (programmeId) => {
    const response = await fetch(`${API_URL}/admin/programmes/${programmeId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete programme');
    return await response.json();
};

export const getProgramDays = async (id) => {
    const response = await fetch(`${API_URL}/admin/programmes/${id}/days`);
    if (!response.ok) throw new Error('Failed to fetch program days');
    return await response.json();
};

export const createProgramDay = async (id, data) => {
    const response = await fetch(`${API_URL}/admin/programmes/${id}/days`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create program day');
    return await response.json();
};

export const updateProgramDay = async (id, data) => {
    const response = await fetch(`${API_URL}/admin/program_days/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update program day');
    return await response.json();
};

export const deleteProgramDay = async (id) => {
    const response = await fetch(`${API_URL}/admin/program_days/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete program day');
    return await response.json();
};

export const getProgramDates = async (id) => {
    const response = await fetch(`${API_URL}/admin/programmes/${id}/dates`);
    if (!response.ok) throw new Error('Failed to fetch program dates');
    return await response.json();
};

export const createDateForProgramme = async (id, data) => {
    const response = await fetch(`${API_URL}/admin/programmes/${id}/dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create date for programme');
    return await response.json();
};

export const deleteAvailableDate = async (id) => {
    const response = await fetch(`${API_URL}/admin/available_dates/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete available date');
    return await response.json();
};

export const getAdminHotels = async () => {
    const response = await fetch(`${API_URL}/admin/hotels`);
    if (!response.ok) throw new Error('Failed to fetch admin hotels');
    return await response.json();
};

export const createHotel = async (hotelData) => {
    const response = await fetch(`${API_URL}/admin/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotelData),
    });
    if (!response.ok) throw new Error('Failed to create hotel');
    return await response.json();
};

export const updateHotel = async (id, data) => {
    const response = await fetch(`${API_URL}/admin/hotels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update hotel');
    return await response.json();
};

export const deleteHotel = async (hotelId) => {
    const response = await fetch(`${API_URL}/admin/hotels/${hotelId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete hotel');
    return await response.json();
};

export const getImagesForHotel = async (id) => {
    const response = await fetch(`${API_URL}/admin/hotels/${id}/images`);
    if (!response.ok) throw new Error('Failed to fetch images for hotel');
    return await response.json();
};

export const addImageToHotel = async (hotelId, formData) => {
    const response = await fetch(`${API_URL}/admin/hotels/${hotelId}/images`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to add image to hotel');
    return await response.json();
};
