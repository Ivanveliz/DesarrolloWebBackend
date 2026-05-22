

//Un middleware es una función que se ejecuta ANTES de entrar a una ruta.
//authMiddleware sirve para proteger el sistema. Si el usuario no tiene la cookie de autenticación, lo redirige al login. Si la tiene, le permite seguir y además le agrega la información del usuario a req.user para que esté disponible en las rutas.
const parseCookies = (cookieHeader) => {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((cookies, item) => {
        const [key, value] = item.split('=');
        if (!key || !value) return cookies;
        cookies[key.trim()] = decodeURIComponent(value.trim());
        return cookies;
    }, {});
};

const authMiddleware = (req, res, next) => {
    const cookies = parseCookies(req.headers.cookie);
    const userCookie = cookies.user;

    if (!userCookie) {
        return res.redirect('/login');
    }

    let user;
    try {
        user = JSON.parse(userCookie);
    } catch (error) {
        return res.redirect('/login');
    }

    req.user = user;
    res.locals.user = user;

    if (req.baseUrl.startsWith('/franquicias') && user.role !== 'admin') {
        return res.status(403).send('Acceso restringido: solo administradores pueden ingresar a franquicias.');
    }

    return next();
};

module.exports = authMiddleware;
