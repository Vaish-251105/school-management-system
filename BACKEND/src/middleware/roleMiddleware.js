const authorizeRoles = (...allowedRoles) => {
  // Flatten if passed as an array e.g. roleMiddleware(['admin', 'teacher'])
  const roles = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      console.warn(`[AUTH] Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${roles.join(', ')}`);
      return res.status(403).json({ message: `Access denied: ${req.user.role} role unauthorized. Required: ${roles.join(', ')}` });
    }

    next();
  };
};

export default authorizeRoles;
export const checkRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export const roleProtect = authorizeRoles;
