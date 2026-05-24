const Franquicia = require('../models/Franquicia');

const getAllFranquicias = async (req, res) => {
    try {

        const franquicias = await Franquicia.find();

        res.format({
            json: () => res.json(franquicias),
            html: () => res.render('franquicias', { franquicias })
        });

    } catch (error) {

        console.log(error);
        res.format({
            json: () => res.status(500).json({ error: 'Error interno del servidor' }),
            html: () => res.status(500).send('Error interno del servidor')
        });

    }
};

const getFranquiciaById = async (req, res) => {
    try {
        const franquicia = await Franquicia.findById(req.params.id);

        if (!franquicia) {
            return res.format({
                json: () => res.status(404).json({ error: 'Franquicia no encontrada' }),
                html: () => res.status(404).send('Franquicia no encontrada')
            });
        }

        res.format({
            json: () => res.json(franquicia),
            html: () => res.render('franquiciaDetalle', { franquicia }) 
        });
    } catch (error) {
        res.format({
            json: () => res.status(500).json({ error: 'Error interno del servidor' }),
            html: () => res.status(500).send('Error interno del servidor')
        });
    }
};

const renderNewForm = (req, res) => {

    res.format({
        json: () => res.json({ isEdit: false, franquicia: null }),
        html: () => res.render('franquiciaForm', {
            isEdit: false,
            franquicia: null
        })
    });

};

const renderEditForm = async (req, res) => {

    try {

        const franquicia = await Franquicia.findById(req.params.id);

        if (!franquicia) {
            return res.format({
                json: () => res.status(404).json({ error: 'Franquicia no encontrada' }),
                html: () => res.status(404).send('Franquicia no encontrada')
            });
        }

        res.format({
            json: () => res.json({ isEdit: true, franquicia }),
            html: () => res.render('franquiciaForm', {
                isEdit: true,
                franquicia
            })
        });

    } catch (error) {

        console.log(error);
        res.format({
            json: () => res.status(500).json({ error: 'Error interno del servidor' }),
            html: () => res.status(500).send('Error interno del servidor')
        });

    }
};

const createFranquicia = async (req, res) => {

    try {

        const {
            razonSocial,
            cuit,
            direccion,
            localidad,
            correo,
            encargado,
            telefono
        } = req.body;

        const existeCuit = await Franquicia.findOne({ cuit });

        if (existeCuit) {
            return res.format({
                json: () => res.status(400).json({ error: 'El CUIT ya se encuentra registrado' }),
                html: () => res.status(400).send('La entidad comercial/CUIT ya se encuentra registrada en la red')
            });
        }

        const existeCorreo = await Franquicia.findOne({ correo });

        if (existeCorreo) {
            return res.format({
                json: () => res.status(400).json({ error: 'El correo ya está asociado a otra franquicia' }),
                html: () => res.status(400).send('El correo electrónico ya está asociado a otra franquicia')
            });
        }

        const nuevaFranquicia = await Franquicia.create({
            razonSocial,
            cuit,
            direccion,
            localidad,
            correo,
            encargado,
            telefono
        });

        res.format({
            json: () => res.status(201).json(nuevaFranquicia),
            html: () => res.redirect('/franquicias?role=admin')
        });

    } catch (error) {

        console.log(error);
        res.format({
            json: () => res.status(500).json({ error: 'Error interno del servidor' }),
            html: () => res.status(500).send('Error interno del servidor')
        });

    }
};

const updateFranquicia = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            razonSocial,
            cuit,
            direccion,
            localidad,
            correo,
            encargado,
            telefono
        } = req.body;

        const updatedFranquicia = await Franquicia.findByIdAndUpdate(
            id,
            {
                razonSocial,
                cuit,
                direccion,
                localidad,
                correo,
                encargado,
                telefono
            },
            { new: true }
        );

        if (!updatedFranquicia) {
            return res.format({
                json: () => res.status(404).json({ error: 'Franquicia no encontrada' }),
                html: () => res.status(404).send('Franquicia no encontrada')
            });
        }

        res.format({
            json: () => res.json(updatedFranquicia),
            html: () => res.redirect('/franquicias?role=admin')
        });

    } catch (error) {

        console.log(error);
        res.format({
            json: () => res.status(500).json({ error: 'Error interno del servidor' }),
            html: () => res.status(500).send('Error interno del servidor')
        });

    }
};

const deleteFranquicia = async (req, res) => {

    try {

        const deleted = await Franquicia.findByIdAndDelete(req.params.id);

        res.format({
            json: () => res.json({ message: 'Franquicia eliminada correctamente', id: req.params.id }),
            html: () => res.redirect('/franquicias?role=admin')
        });

    } catch (error) {

        console.log(error);
        res.format({
            json: () => res.status(500).json({ error: 'Error interno del servidor' }),
            html: () => res.status(500).send('Error interno del servidor')
        });

    }
};

module.exports = {
    getAllFranquicias,
    getFranquiciaById,
    renderNewForm,
    renderEditForm,
    createFranquicia,
    updateFranquicia,
    deleteFranquicia
};