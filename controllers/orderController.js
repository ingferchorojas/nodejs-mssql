const { sql } = require('../config/db');

// Obtener datos de órdenes
const getOrderData = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT TOP 25 * FROM app_orders 
            WHERE user_id = ${req.user.id} AND deleted = 0 
            ORDER BY created_at DESC;
        `;
        
        res.status(200).json({ message: 'Órdenes obtenidas correctamente', data: result.recordset, success: true });
    } catch (error) {
        console.error('Error fetching order data:', error);
        res.status(500).json({ message: 'Error al obtener órdenes', success: false });
    }
};

// Agregar una nueva orden
const addOrder = async (req, res) => {
    const { products, client, total } = req.body;

    if (!products || !client || total === undefined) {
        return res.status(400).json({ message: 'Todos los campos son requeridos', success: false });
    }

    try {
        await sql.query`
            INSERT INTO app_orders (user_id, products, client, total)
            VALUES (${req.user.id}, ${JSON.stringify(products)}, ${JSON.stringify(client)}, ${total});
        `;
        res.status(201).json({ message: 'Orden agregada correctamente', success: true });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Error al agregar orden', success: false });
    }
};

// Eliminar una orden
const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const result = await sql.query`
            UPDATE app_orders 
            SET deleted = 1 
            WHERE order_id = ${orderId} AND user_id = ${req.user.id};
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Orden no encontrada', success: false });
        }

        res.status(200).json({ message: 'Orden marcada como eliminada correctamente', success: true });
    } catch (error) {
        console.error('Error al marcar orden como eliminada:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de la orden', success: false });
    }
};

// Actualizar una orden
const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { products, client, total } = req.body;

    if (!products || !client || total === undefined) {
        return res.status(400).json({ message: 'Todos los campos son requeridos', success: false });
    }

    try {
        const result = await sql.query`
            UPDATE app_orders 
            SET products = ${JSON.stringify(products)}, client = ${JSON.stringify(client)}, total = ${total}
            WHERE order_id = ${orderId} AND user_id = ${req.user.id};
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Orden no encontrada', success: false });
        }

        res.status(200).json({ message: 'Orden actualizada correctamente', success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error al actualizar la orden', success: false });
    }
};

module.exports = {
    getOrderData,
    addOrder,
    deleteOrder,
    updateOrder
};
