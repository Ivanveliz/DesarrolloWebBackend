const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role !== 'admin') {
        return res.format({
            json: () => res.status(403).json({ error: 'Acceso denegado: Funcionalidad exclusiva de administradores.' }),
            html: () => res.status(403).send('Acceso denegado: Funcionalidad exclusiva de administradores.')
        });
    }
    next();
};

const blockOperario = (req, res, next) => {
    if (req.user && req.user.role === 'operario') {
        return res.format({
            json: () => res.status(403).json({ error: 'Acceso denegado: Los operarios no pueden modificar la información.' }),
            html: () => res.status(403).send('Acceso denegado: Los operarios no pueden modificar la información.')
        });
    }
    next();
};

module.exports = { requireAdmin, blockOperario };
