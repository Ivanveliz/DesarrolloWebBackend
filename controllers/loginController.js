const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const parseCookies = (cookieHeader) => {
//     if (!cookieHeader) return {};
//     return cookieHeader.split(';').reduce((cookies, item) => {
//         const [key, value] = item.split('=');
//         if (!key || !value) return cookies;
//         cookies[key.trim()] = decodeURIComponent(value.trim());
//         return cookies;
//     }, {});
// };

// const renderLoginForm = (req, res) => {
//     const cookies = parseCookies(req.headers.cookie);
//     if (cookies.user) {
//         return res.redirect('/');
//     }

//     res.render('login', {
//         error: null,
//         email: ''
//     });
// };

const renderLoginForm = (req, res) => {
    // Leemos la cookie 'jwt' muy fácilmente gracias a cookie-parser
    if (req.cookies.jwt) {
        return res.redirect('/');
    }
    res.render('login', {
        error: null,
        email: ''
    });
};


// iNICIA EL PROCESO DE LOGIN, VERIFICA LAS CREDENCIALES Y VE LA COOKIE SI SON CORRECTAS
const processLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // const employee = await Employee.findOne({ email, password });
        const employee = await Employee.findOne({ email }).select("+password");

        if (!employee) {
            return res.format({
                json: () => res.status(401).json({ error: 'Email o contraseña incorrectos' }),
                html: () => res.render('login', {
                    error: 'Email o contraseña incorrectos',
                    email
                })
            });
        }

        // Validamos la contraseña usando bcrypt
        const validPassword = await bcrypt.compare(password, employee.password);
        if (!validPassword) {
            return res.format({
                json: () => res.status(401).json({ error: 'Email o contraseña incorrectos' }),
                html: () => res.render('login', {
                    error: 'Email o contraseña incorrectos',
                    email
                })
            });
        }

        const token = jwt.sign(
            {
                id: employee._id,
                email: employee.email,
                role: employee.role,
                franquiciaId: employee.franquiciaId
            },
            process.env.JWT_SECRET, // Usamos la variable de entorno
            { expiresIn: '24h' } // El token expira en 24 horas
        );

        // Guardamos el Token en una cookie llamada 'jwt'
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 horas en milisegundos
        });

        // res.cookie('user', JSON.stringify({ email: employee.email, role: employee.role }), {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000
        // });

        res.format({
            json: () => res.json({ message: 'Login exitoso', user: { email: employee.email, role: employee.role } }),
            html: () => {
                // Redirección basada en rol
                if (employee.role === 'admin') {
                    return res.redirect('/'); // El admin va a la lista de empleados
                } else {
                    return res.redirect('/pedidos'); // El operario va directo a sus pedidos
                }
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

const logout = (req, res) => {
    // res.clearCookie('user');
    // Limpiamos la nueva cookie 'jwt' al salir
    res.clearCookie('jwt');
    res.redirect('/login');
};

module.exports = {
    renderLoginForm,
    processLogin,
    logout
};