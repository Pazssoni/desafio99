import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      
      req.userId = decoded.userId;

      next(); 
    } catch (error) {
      res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Acesso não autorizado, token não encontrado.' });
  }
};