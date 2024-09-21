const jwt = require("jsonwebtoken");


const authorizeRoles = (...permittedRoles) => {
    return(req, res, next) => {
        try {
            const token = req.cookies.accessToken;
            if(!token) {
                return res.status(401).json({ message: 'No access token found' });
            }

            const decodedToken = jwt.verify(token, 'test');

            if(!permittedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (err) {
            console.error('Error during authorize roles:', err);
            res.status(500).json({ error: 'Authorization failed' });
        }
    }
}

module.exports = authorizeRoles;