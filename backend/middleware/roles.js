const roles = {
    ADMIN: 'admin',
    MEMBER: 'member'
};

const authorize = (rolesArray) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access denied. No user role found.' });
        }

        const hasRole = rolesArray.includes(req.user.role);
        if (!hasRole) {
            return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
        }

        next();
    };
};

module.exports = {
    roles,
    authorize
};