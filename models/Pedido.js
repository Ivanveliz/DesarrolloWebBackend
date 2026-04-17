const fs = require('fs');
const path = require('path');

// Definimos la ruta al archivo JSON
const filePath = path.join(__dirname, '../config/pedidos.json');

class Pedido {
    constructor(franquiciaId, productos) {
        // Validación de datos
        if (!franquiciaId || !productos || productos.length === 0) {
            throw new Error("Missing required data: franquiciaId and at least one product.");
        }
        // Validación estricta- CADA producto debe tener ID y cantidad
        const validProducts = productos.every(p => p.productoId && p.cantidad && p.cantidad > 0);
        if (!validProducts) {
            throw new Error("Each product must have a valid 'productoId' and 'cantidad' greater than 0.");
        }

        // Lógica de ID numérico secuencial
        const pedidos = Pedido.getAll();
        this.id = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;
        
        this.franquiciaId = franquiciaId;
        this.productos = productos; // Array de { productoId, cantidad }
        this.estado = "pendiente"; 
        this.fecha = new Date().toISOString();
    }

    // --- HELPERS DE PERSISTENCIA ---

    static getAll() {
        try {
            // Leer el archivo físico
            const data = fs.readFileSync(filePath, 'utf-8');
            // Convertir el texto plano a un objeto JS
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, devolvemos un array vacío para no romper la app
            return [];
        }
    }

    static saveAll(pedidos) {
        // Convertimos el objeto JS a texto plano con formato (identación de 2 espacios)
        fs.writeFileSync(filePath, JSON.stringify(pedidos, null, 2), 'utf-8');
    }

    // --- OPERACIONES CRUD ---

    // CREATE
    create() {
        const pedidos = Pedido.getAll();
        pedidos.push(this); // Agregamos la instancia actual
        Pedido.saveAll(pedidos);
        return this;
    }

    // READ (por ID)
    static getById(id) {
        const pedidos = Pedido.getAll();
        // Usamos parseInt porque el ID que viene por la URL suele ser un string
        return pedidos.find(p => p.id === parseInt(id));
    }

    // UPDATE
    static update(id, updatedData) {
        const pedidos = Pedido.getAll();
        const index = pedidos.findIndex(p => p.id === parseInt(id));
        
        if (index !== -1) {
            // Mantenemos el ID original y sobreescribimos el resto con los nuevos datos
            pedidos[index] = { ...pedidos[index], ...updatedData, id: pedidos[index].id };
            Pedido.saveAll(pedidos);
            return pedidos[index];
        }
        return null;
    }

    // DELETE
    static delete(id) {
        let pedidos = Pedido.getAll();
        const initialLength = pedidos.length;
        
        // Filtramos para quitar el elemento con ese ID
        pedidos = pedidos.filter(p => p.id !== parseInt(id));
        
        if (pedidos.length < initialLength) {
            Pedido.saveAll(pedidos);
            return true;
        }
        return false;
    }
}

module.exports = Pedido;