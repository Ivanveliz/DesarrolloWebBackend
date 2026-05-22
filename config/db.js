const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB conectado");

    await crearAdminInicial();
  } catch (error) {
    console.log("Error Mongo:", error);

    process.exit(1);
  }
};

const crearAdminInicial = async () => {
  try {
    const adminEmail = 'admin@admin.com';
    const admin = await Employee.findOne({ email: adminEmail });

    if (!admin) {
      await Employee.create({
        name: 'Admin',
        surname: 'Principal',
        dni: 11111111,
        role: 'admin',
        shift: 'Mañana',
        email: adminEmail,
        password: '1234'
      });
      console.log('Usuario admin creado:', adminEmail);
    }
  } catch (error) {
    console.log('Error al crear admin inicial:', error);
  }
};

module.exports = conectarDB;