const jwt = require('jsonwebtoken');

//authMiddleware sirve para proteger el sistema. Si el usuario no tiene la cookie de autenticación, lo redirige al login. Si la tiene, le permite seguir y además le agrega la información del usuario a req.user para que esté disponible en las rutas.
// const parseCookies = (cookieHeader) => {
//     if (!cookieHeader) return {};
//     return cookieHeader.split(';').reduce((cookies, item) => {
//         const [key, value] = item.split('=');
//         if (!key || !value) return cookies;
//         cookies[key.trim()] = decodeURIComponent(value.trim());
//         return cookies;
//     }, {});
// };

const authMiddleware = (req, res, next) => {
    // const cookies = parseCookies(req.headers.cookie);
    // const userCookie = cookies.user;
    const token = req.cookies.jwt;

    if (!token) {
        return res.format({
            json: () => res.status(401).json({ error: 'No autenticado. Por favor, inicia sesión.' }),
            html: () => res.redirect('/login')
        });
    }

    let user;
    try {
        // user = JSON.parse(userCookie);

        // Verificamos el token usando nuestra clave secreta
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos los datos decodificados para que estén disponibles en las rutas y vistas
        req.user = decodedUser;
        res.locals.user = decodedUser;

        return next();

    } catch (error) {
        res.clearCookie('jwt');
        return res.format({
            json: () => res.status(401).json({ error: 'Sesión inválida.' }),
            html: () => res.redirect('/login')
        });
    }

    // req.user = user;
    // res.locals.user = user;

};

module.exports = authMiddleware;
