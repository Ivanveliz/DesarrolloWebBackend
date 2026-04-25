const Employee = require('../models/Employee');
const data = require('../config/bbdd.json');

let employees = data.map(
    emp => new Employee(emp.id, emp.name, emp.surname, emp.dni, emp.role, emp.shift)
);

const getAllEmployees = (req, res) => {
    try {
        res.format({
            'application/json': () => res.status(200).json({ employees }),
            'text/html': () => res.render('index', { employees })
        });
    } catch (error) {
        res.status(500).send('Error interno del servidor al obtener empleados');
    }
};

const getEmployeeById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const employee = employees.find(emp => emp.id === id);

        if (!employee) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        res.format({
            'application/json': () => res.json(employee),
            'text/html': () => res.send(`<h1>Perfil del Empleado</h1><pre>${JSON.stringify(employee, null, 2)}</pre>`)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al obtener el empleado' });
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

        res.format({
            'application/json': () => res.status(201).json(newEmployee),
            'text/html': () => res.redirect('/')
        });
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

        res.format({
            'application/json': () => res.status(200).json(employees[index]),
            'text/html': () => res.redirect('/')
        });
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
        res.format({
            'application/json': () => res.status(204).send(),
            'text/html': () => res.redirect('/')
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
