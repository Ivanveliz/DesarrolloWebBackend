const Employee = require('../models/Employee');
const data = require('../bbdd.json');

let employees = data.map(
    emp => new Employee(emp.id, emp.name, emp.surname, emp.dni, emp.role, emp.shift)
);

const getAllEmployees = (req, res) => {
    try {
        res.render('index', { employees });
    } catch (error) {
        res.status(500).send('Error interno del servidor al obtener empleados');
    }
};

const renderNewForm = (req, res) => {
    res.render('form', { isEdit: false, employee: null });
};

const renderEditForm = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const employee = employees.find(emp => emp.id === id);

        if (!employee) {
            return res.status(404).send('Empleado no encontrado');
        }

        res.render('form', { isEdit: true, employee });
    } catch (error) {
        res.status(500).send('Error interno');
    }
};

const createEmployee = (req, res) => {
    try {
        const { name, surname, dni, role, shift } = req.body;
        const id = (employees.at(-1)?.id || 0) + 1;
        const newEmployee = new Employee(id, name, surname, dni, role, shift);

        employees.push(newEmployee);


        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error interno del servidor al crear el empleado');
    }
};


const updateEmployee = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = employees.findIndex(emp => emp.id === id);

        if (index === -1) {
            return res.status(404).send('Empleado no encontrado');
        }

        const { name, surname, dni, role, shift } = req.body;
        employees[index] = new Employee(id, name, surname, dni, role, shift);

        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error al actualizar');
    }
};


const deleteEmployee = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = employees.findIndex(emp => emp.id === id);

        if (index === -1) {
            return res.status(404).send('Empleado no encontrado');
        }

        employees.splice(index, 1);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error al eliminar');
    }
};

module.exports = {
    getAllEmployees,
    renderNewForm,
    renderEditForm,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
