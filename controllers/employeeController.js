const Employee = require('../models/Employee');



const getAllEmployees = async (req, res) => {

    try {

        const employees = await Employee.find();

        res.format({

            'application/json': () =>
                res.status(200).json({ employees }),

            'text/html': () =>
                res.render('empleados', { employees })

        });

    } catch (error) {

        res.status(500).send('Error interno del servidor');

    }

};



const getEmployeeById = async (req, res) => {

    try {

        const id = req.params.id;

        const employee = await Employee.findById(id);

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

        res.status(500).json({
            error: 'Error interno al obtener el empleado'
        });

    }

};



const renderNewForm = (req, res) => {

    res.render('form', {
        isEdit: false,
        employee: null
    });

};



const renderEditForm = async (req, res) => {

    try {

        const id = req.params.id;

        const employee = await Employee.findById(id);

        if (!employee) {

            return res.status(404).send('Empleado no encontrado');

        }

        res.render('form', {
            isEdit: true,
            employee
        });

    } catch (error) {

        res.status(500).send('Error interno');

    }

};



const createEmployee = async (req, res) => {

    try {

        const { name, surname, dni, role, shift, email, password } = req.body;

        const newEmployee = await Employee.create({
            name,
            surname,
            dni,
            role,
            shift,
            email,
            password
        });

        res.format({

            'application/json': () =>
                res.status(201).json(newEmployee),

            'text/html': () =>
                res.redirect('/empleados')

        });

    } catch (error) {

        console.log(error);

        res.status(500).send('Error interno del servidor');

    }

};


const updateEmployee = async (req, res) => {

    try {

        const id = req.params.id;

        const { name, surname, dni, role, shift, email, password } = req.body;

        const updatedEmployee =
            await Employee.findByIdAndUpdate(
                id,
                {
                    name,
                    surname,
                    dni,
                    role,
                    shift,
                    email,
                    password
                },
                { new: true }
            );

        if (!updatedEmployee) {

            return res.status(404).send('Empleado no encontrado');

        }

        res.format({

            'application/json': () =>
                res.status(200).json(updatedEmployee),

            'text/html': () =>
                res.redirect('/empleados')

        });

    } catch (error) {

        res.status(500).send('Error al actualizar');

    }

};



const deleteEmployee = async (req, res) => {

    try {

        const id = req.params.id;

        const deletedEmployee =
            await Employee.findByIdAndDelete(id);

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