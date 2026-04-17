class Person {
    constructor(id, name, surname, dni) {

        this.id = id;
        this.name = name;
        this.surname = surname;
        this.dni = dni;
    }


    getFullName() {
        return {
            name: this.name,
            surname: this.surname,
            fullName: `${this.name} ${this.surname}`
        };
    }
}

module.exports = Person;
