const Franquicia = require('../models/Franquicia');

const getAllFranquicias = async (req, res) => {
    try {

        const franquicias = await Franquicia.find();

        res.render('franquicias', { franquicias });

    } catch (error) {

        console.log(error);
        res.status(500).send('Error interno del servidor');

    }
};

const renderNewForm = (req, res) => {

    res.render('franquiciaForm', {
        isEdit: false,
        franquicia: null
    });

};

const renderEditForm = async (req, res) => {

    try {

        const franquicia = await Franquicia.findById(req.params.id);

        if (!franquicia) {
            return res.status(404).send('Franquicia no encontrada');
        }

        res.render('franquiciaForm', {
            isEdit: true,
            franquicia
        });

    } catch (error) {

        console.log(error);
        res.status(500).send('Error interno del servidor');

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
            return res.send('La entidad comercial/CUIT ya se encuentra registrada en la red');
        }

        const existeCorreo = await Franquicia.findOne({ correo });

        if (existeCorreo) {
            return res.send('El correo electrónico ya está asociado a otra franquicia');
        }

        await Franquicia.create({
            razonSocial,
            cuit,
            direccion,
            localidad,
            correo,
            encargado,
            telefono
        });

        res.redirect('/franquicias?role=admin');

    } catch (error) {

        console.log(error);
        res.status(500).send('Error interno del servidor');

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
            return res.status(404).send('Franquicia no encontrada');
        }

        res.redirect('/franquicias?role=admin');

    } catch (error) {

        console.log(error);
        res.status(500).send('Error interno del servidor');

    }
};

const deleteFranquicia = async (req, res) => {

    try {

        await Franquicia.findByIdAndDelete(req.params.id);

        res.redirect('/franquicias?role=admin');

    } catch (error) {

        console.log(error);
        res.status(500).send('Error interno del servidor');

    }
};

module.exports = {
    getAllFranquicias,
    renderNewForm,
    renderEditForm,
    createFranquicia,
    updateFranquicia,
    deleteFranquicia
};