const Employee = require('../models/Employee');


const parseCookies = (cookieHeader) => {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((cookies, item) => {
        const [key, value] = item.split('=');
        if (!key || !value) return cookies;
        cookies[key.trim()] = decodeURIComponent(value.trim());
        return cookies;
    }, {});
};

const renderLoginForm = (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.user) {
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

        const employee = await Employee.findOne({ email, password });

        if (!employee) {
            return res.format({
                json: () => res.status(401).json({ error: 'Email o contraseña incorrectos' }),
                html: () => res.render('login', {
                    error: 'Email o contraseña incorrectos',
                    email
                })
            });
        }

        res.cookie('user', JSON.stringify({ email: employee.email, role: employee.role }), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.format({
            json: () => res.json({ message: 'Login exitoso', user: { email: employee.email, role: employee.role } }),
            html: () => res.redirect('/')
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

const logout = (req, res) => {
    res.clearCookie('user');
    res.redirect('/login');
};

module.exports = {
    renderLoginForm,
    processLogin,
    logout
};
