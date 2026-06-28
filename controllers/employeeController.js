const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const Franquicia = require('../models/Franquicia');

const validarDni = (dni) => {
    return /^[0-9]{7,8}$/.test(String(dni));
};

const obtenerMensajeErrorEmpleado = (error) => {
    console.log("DETALLE DEL ERROR EMPLEADO:", {
        name: error.name,
        code: error.code,
        message: error.message,
        errors: error.errors,
        keyValue: error.keyValue
    });

    if (error.code === 11000) {
        if (error.keyValue && error.keyValue.email) {
            return 'Ya existe un empleado registrado con ese email.';
        }

        if (error.keyValue && error.keyValue.dni) {
            return 'Ya existe un empleado registrado con ese DNI.';
        }

        return 'Ya existe un empleado con un dato repetido.';
    }

    if (error.name === 'ValidationError') {
        if (error.errors && error.errors.dni) {
            return 'DNI incorrecto. Ingresá solo números, sin letras ni puntos.';
        }

        if (error.errors && error.errors.email) {
            return 'Email incorrecto o faltante.';
        }

        if (error.errors && error.errors.password) {
            return 'La contraseña es obligatoria.';
        }

        if (error.errors && error.errors.role) {
            return 'Seleccioná un rol para el empleado.';
        }

        if (error.errors && error.errors.shift) {
            return 'Seleccioná un turno para el empleado.';
        }

        if (error.errors && error.errors.franquiciaId) {
            return 'Seleccioná una franquicia válida para el empleado.';
        }

        return Object.values(error.errors)
            .map(err => err.message)
            .join(' ');
    }

    if (error.name === 'CastError' && error.path === 'dni') {
        return 'DNI incorrecto. Ingresá solo números, sin letras ni puntos.';
    }

    if (error.name === 'CastError' && error.path === 'franquiciaId') {
        return 'Seleccioná una franquicia válida para el empleado.';
    }

    if (error.message && error.message.includes('Cast to Number failed') && error.message.includes('dni')) {
        return 'DNI incorrecto. Ingresá solo números, sin letras ni puntos.';
    }

    return `No se pudo guardar el empleado: ${error.message}`;
};

const renderizarFormularioEmpleado = async (res, isEdit, employee, error = null, status = 200) => {
    const franquicias = await Franquicia.find()
        .sort({ razonSocial: 1 })
        .lean();

    return res.status(status).render('empleadoForm', {
        isEdit,
        employee,
        franquicias,
        error
    });
};

const validarFranquiciaSegunRol = (role, franquiciaId) => {
    if (role === 'operario' && !franquiciaId) {
        return 'Los empleados operarios deben estar vinculados a una franquicia.';
    }

    return null;
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .select('-password')
            .populate('franquiciaId')
            .lean();

        res.format({
            'application/json': () => res.status(200).json({ employees }),
            'text/html': () => res.render('empleados', { employees })
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;

        const employee = await Employee.findById(id)
            .select('-password')
            .populate('franquiciaId');

        if (!employee) {
            return res.status(404).json({
                error: 'Empleado no encontrado'
            });
        }

        res.format({
            'application/json': () =>
                res.json(employee),

            'text/html': () =>
                res.send(`
                    <h1>Perfil del Empleado</h1>
                    <pre>${JSON.stringify(employee, null, 2)}</pre>
                `)
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Error interno al obtener el empleado'
        });
    }
};

const renderNewForm = async (req, res) => {
    await renderizarFormularioEmpleado(res, false, null, null);
};

const renderEditForm = async (req, res) => {
    try {
        const id = req.params.id;

        const employee = await Employee.findById(id)
            .select('-password')
            .lean();

        if (!employee) {
            return res.status(404).send('Empleado no encontrado');
        }

        await renderizarFormularioEmpleado(res, true, employee, null);

    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno');
    }
};

const createEmployee = async (req, res) => {
    try {
        const {
            name,
            surname,
            dni,
            role,
            shift,
            email,
            password,
            franquiciaId
        } = req.body;

        if (!validarDni(dni)) {
            return await renderizarFormularioEmpleado(
                res,
                false,
                req.body,
                'DNI incorrecto. Ingresá solo números, sin letras ni puntos.',
                400
            );
        }

        const existeDni = await Employee.findOne({ dni: Number(dni) });

        if (existeDni) {
            return await renderizarFormularioEmpleado(
                res,
                false,
                req.body,
                'Ya existe un empleado registrado con ese DNI.',
                400
            );
        }

        if (!password || password.trim() === '') {
            return await renderizarFormularioEmpleado(
                res,
                false,
                req.body,
                'La contraseña es obligatoria.',
                400
            );
        }

        const errorFranquicia = validarFranquiciaSegunRol(role, franquiciaId);

        if (errorFranquicia) {
            return await renderizarFormularioEmpleado(
                res,
                false,
                req.body,
                errorFranquicia,
                400
            );
        }

        const newEmployee = await Employee.create({
            name,
            surname,
            dni,
            role,
            shift,
            email,
            password,
            franquiciaId: role === 'admin' ? null : franquiciaId
        });

        const employeeSinPassword = newEmployee.toObject();
        delete employeeSinPassword.password;

        res.format({
            'application/json': () =>
                res.status(201).json(employeeSinPassword),

            'text/html': () =>
                res.redirect('/empleados')
        });

    } catch (error) {
        console.log('Error al crear empleado:', error);

        return await renderizarFormularioEmpleado(
            res,
            false,
            req.body,
            obtenerMensajeErrorEmpleado(error),
            400
        );
    }
};

const updateEmployee = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            name,
            surname,
            dni,
            role,
            shift,
            email,
            password,
            franquiciaId
        } = req.body;

        if (!validarDni(dni)) {
            return await renderizarFormularioEmpleado(
                res,
                true,
                {
                    _id: id,
                    ...req.body
                },
                'DNI incorrecto. Ingresá solo números, sin letras ni puntos.',
                400
            );
        }

        const existeDni = await Employee.findOne({
            dni: Number(dni),
            _id: { $ne: id }
        });

        if (existeDni) {
            return await renderizarFormularioEmpleado(
                res,
                true,
                {
                    _id: id,
                    ...req.body
                },
                'Ya existe un empleado registrado con ese DNI.',
                400
            );
        }

        const errorFranquicia = validarFranquiciaSegunRol(role, franquiciaId);

        if (errorFranquicia) {
            return await renderizarFormularioEmpleado(
                res,
                true,
                {
                    _id: id,
                    ...req.body
                },
                errorFranquicia,
                400
            );
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).send('Empleado no encontrado');
        }

        const updateData = {
            name,
            surname,
            dni,
            role,
            shift,
            email,
            franquiciaId: role === 'admin' ? null : franquiciaId
        };

        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        res.format({
            'application/json': () => res.status(200).json(updatedEmployee),
            'text/html': () => res.redirect('/empleados')
        });

    } catch (error) {
        console.log(error);

        return await renderizarFormularioEmpleado(
            res,
            true,
            {
                _id: req.params.id,
                ...req.body
            },
            obtenerMensajeErrorEmpleado(error),
            400
        );
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).send('Empleado no encontrado');
        }

        res.format({
            'application/json': () =>
                res.status(204).send(),

            'text/html': () =>
                res.redirect('/empleados')
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar');
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    renderNewForm,
    renderEditForm,
    createEmployee,
    updateEmployee,
    deleteEmployee
};