const Person = require('./Person');

class Employee extends Person {
    constructor(id, name, surname, dni, role, shift) {

        // super llama al constructor de la clase padre (Person) es muy  de JS el super

        super(id, name, surname, dni);
        this.role = role;
        this.shift = shift;
    }

    getEmploye() {
        return {
            fullName: this.getFullName(),
            workPosition: this.role,
            workShift: this.shift
        }
    }
}

module.exports = Employee;
