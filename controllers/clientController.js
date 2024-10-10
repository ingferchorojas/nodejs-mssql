const { sql } = require('../config/db');

// Obtener datos de clientes
const getClientData = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT * FROM app_clients;
        `;
        
        res.status(200).json({ message: 'Clientes obtenidos correctamente', data: result.recordset, success: true });
    } catch (error) {
        console.error('Error fetching client data:', error);
        res.status(500).json({ message: 'Error al obtener clientes', success: false });
    }
};

// Agregar un nuevo cliente
const addClient = async (req, res) => {
    const { name, address, phone, latitude, longitude, ruc_id, ruc_reason } = req.body;

    if (!name || !address || !phone || latitude === undefined || longitude === undefined || !ruc_id || !ruc_reason) {
        return res.status(400).json({ message: 'Todos los campos son requeridos', success: false });
    }

    try {
        await sql.query`
            INSERT INTO app_clients (name, address, phone, latitude, longitude, ruc_id, ruc_reason)
            VALUES (${name.trim()}, ${address.trim()}, ${phone.trim()}, ${latitude}, ${longitude}, ${ruc_id.trim()}, ${ruc_reason.trim()});
        `;
        res.status(201).json({ message: 'Cliente agregado correctamente', success: true });
    } catch (error) {
        console.error('Error adding client:', error);
        res.status(500).json({ message: 'Error al agregar cliente', success: false });
    }
};

// Eliminar un cliente
const deleteClient = async (req, res) => {
    const { clientId } = req.params;

    try {
        const result = await sql.query`
            DELETE FROM app_clients WHERE client_id = ${clientId};
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado', success: false });
        }

        res.status(200).json({ message: 'Cliente eliminado correctamente', success: true });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ message: 'Error al eliminar cliente', success: false });
    }
};

// Actualizar un cliente
const updateClient = async (req, res) => {
    const { clientId } = req.params;
    const { name, address, phone, latitude, longitude, ruc_id, ruc_reason } = req.body;

    if (!name || !address || !phone || latitude === undefined || longitude === undefined || !ruc_id || !ruc_reason) {
        return res.status(400).json({ message: 'Todos los campos son requeridos', success: false });
    }

    try {
        const result = await sql.query`
            UPDATE app_clients 
            SET name = ${name.trim()}, address = ${address.trim()}, phone = ${phone.trim()}, 
                latitude = ${latitude}, longitude = ${longitude}, ruc_id = ${ruc_id.trim()}, ruc_reason = ${ruc_reason.trim()}
            WHERE client_id = ${clientId};
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado', success: false });
        }

        res.status(200).json({ message: 'Cliente actualizado correctamente', success: true });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Error al actualizar cliente', success: false });
    }
};

module.exports = {
    getClientData,
    addClient,
    deleteClient,
    updateClient
};