const Franquicia = require('../models/Franquicia');

const validarCuit = (cuit) => {
    return /^[0-9]{11}$/.test(String(cuit));
};

const renderizarFormularioConError = (res, isEdit, franquicia, error) => {
    return res.status(400).format({
        json: () => res.json({ error }),

        html: () => res.render('franquiciaForm', {
            isEdit,
            franquicia,
            error
        }),

        default: () => res.json({ error })
    });
};

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
        console.log(error);

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
            franquicia: null,
            error: null
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
                franquicia,
                error: null
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

        if (!validarCuit(cuit)) {
            return renderizarFormularioConError(
                res,
                false,
                req.body,
                'CUIT incorrecto. Ingresá 11 números, sin letras, puntos ni guiones.'
            );
        }

        const existeCuit = await Franquicia.findOne({ cuit });

        if (existeCuit) {
            return renderizarFormularioConError(
                res,
                false,
                req.body,
                'El CUIT ya se encuentra registrado.'
            );
        }

        const existeCorreo = await Franquicia.findOne({ correo });

        if (existeCorreo) {
            return renderizarFormularioConError(
                res,
                false,
                req.body,
                'El correo electrónico ya está asociado a otra franquicia.'
            );
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
            html: () => res.redirect('/franquicias')
        });

    } catch (error) {

        console.log(error);

        let mensaje = 'No se pudo crear la franquicia.';

        if (error.code === 11000) {
            mensaje = 'Ya existe una franquicia con ese CUIT o correo.';
        }

        res.format({
            json: () => res.status(400).json({ error: mensaje }),
            html: () => renderizarFormularioConError(res, false, req.body, mensaje)
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

        if (!validarCuit(cuit)) {
            return renderizarFormularioConError(
                res,
                true,
                {
                    _id: id,
                    ...req.body
                },
                'CUIT incorrecto. Ingresá 11 números, sin letras, puntos ni guiones.'
            );
        }

        const existeCuit = await Franquicia.findOne({
            cuit,
            _id: { $ne: id }
        });

        if (existeCuit) {
            return renderizarFormularioConError(
                res,
                true,
                {
                    _id: id,
                    ...req.body
                },
                'El CUIT ya se encuentra registrado en otra franquicia.'
            );
        }

        const existeCorreo = await Franquicia.findOne({
            correo,
            _id: { $ne: id }
        });

        if (existeCorreo) {
            return renderizarFormularioConError(
                res,
                true,
                {
                    _id: id,
                    ...req.body
                },
                'El correo electrónico ya está asociado a otra franquicia.'
            );
        }

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
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedFranquicia) {
            return res.format({
                json: () => res.status(404).json({ error: 'Franquicia no encontrada' }),
                html: () => res.status(404).send('Franquicia no encontrada')
            });
        }

        res.format({
            json: () => res.json(updatedFranquicia),
            html: () => res.redirect('/franquicias')
        });

    } catch (error) {

        console.log(error);

        let mensaje = 'No se pudo actualizar la franquicia.';

        if (error.code === 11000) {
            mensaje = 'Ya existe una franquicia con ese CUIT o correo.';
        }

        res.format({
            json: () => res.status(400).json({ error: mensaje }),
            html: () => renderizarFormularioConError(
                res,
                true,
                {
                    _id: req.params.id,
                    ...req.body
                },
                mensaje
            )
        });

    }
};

const deleteFranquicia = async (req, res) => {

    try {

        const deleted = await Franquicia.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.format({
                json: () => res.status(404).json({ error: 'Franquicia no encontrada' }),
                html: () => res.status(404).send('Franquicia no encontrada')
            });
        }

        res.format({
            json: () => res.json({ message: 'Franquicia eliminada correctamente', id: req.params.id }),
            html: () => res.redirect('/franquicias')
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