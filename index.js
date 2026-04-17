const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const employeeRoutes = require('./routes/employeeRoutes');

//esto es por que si no no anda el delete

const methodOverride = require('method-override');

app.set('view engine', 'pug');
app.set('views', './views');

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}/`);
});
