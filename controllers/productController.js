const { sql } = require('../config/db');

// Obtener datos de productos
const getProductData = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT * FROM app_products WHERE deleted = 0;
        `;
        
        res.status(200).json({ message: 'Productos obtenidos correctamente', data: result.recordset, success: true });
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ message: 'Error al obtener productos', success: false });
    }
};

// Buscar productos
const searchProduct = async (req, res) => {
    const { term } = req.query; // Se obtiene el término de búsqueda de los parámetros de consulta

    if (!term || term.trim() === '') {
        return res.status(400).json({ message: 'El término de búsqueda es requerido', success: false });
    }

    try {
        const result = await sql.query`
            SELECT * FROM app_products 
            WHERE deleted = 0 
            AND (name LIKE ${'%' + term + '%'} OR code LIKE ${'%' + term + '%'});
        `;
        
        res.status(200).json({ message: 'Productos encontrados correctamente', data: result.recordset, success: true });
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ message: 'Error al buscar productos', success: false });
    }
};

// Agregar un nuevo producto
const addProduct = async (req, res) => {
    const { name, description, code, prices } = req.body;

    if (!name || !description || !code || !prices || !Array.isArray(prices)) {
        return res.status(400).json({ message: 'Todos los campos son requeridos y prices debe ser un array', success: false });
    }

    try {
        await sql.query`
            INSERT INTO app_products (name, description, code, prices, user_id)
            VALUES (${name.trim()}, ${description.trim()}, ${code.trim()}, ${JSON.stringify(prices)}, ${req.user.id});
        `;
        res.status(201).json({ message: 'Producto agregado correctamente', success: true });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error al agregar producto', success: false });
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await sql.query`
            UPDATE app_products 
            SET deleted = 1 
            WHERE id = ${productId};
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Producto no encontrado', success: false });
        }

        res.status(200).json({ message: 'Producto marcado como eliminado correctamente', success: true });
    } catch (error) {
        console.error('Error al marcar producto como eliminado:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del producto', success: false });
    }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, code, prices } = req.body;

    if (!name || !description || !code || !prices || !Array.isArray(prices)) {
        return res.status(400).json({ message: 'Todos los campos son requeridos y prices debe ser un array', success: false });
    }

    try {
        const result = await sql.query`
            UPDATE app_products 
            SET name = ${name.trim()}, description = ${description.trim()}, code = ${code.trim()}, prices = ${JSON.stringify(prices)}
            WHERE id = ${productId};
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Producto no encontrado', success: false });
        }

        res.status(200).json({ message: 'Producto actualizado correctamente', success: true });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error al actualizar producto', success: false });
    }
};

module.exports = {
    getProductData,
    searchProduct,
    addProduct,
    deleteProduct,
    updateProduct
};
