import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define custom types for decoded token payloads
interface AdminPayload {
  adminId: number;
  email: string;
}

interface EmployeePayload {
  employeeId: number;
  name: string;
  // Add other employee properties as needed
}

interface ClientPayload {
  clientId: string;
  // Add other client properties as needed
}

interface UserPayload {
  id: string;
  username: string;
}

// Augment the Express Request interface to include authenticated user properties
declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
      employee?: EmployeePayload;
      client?: ClientPayload;
      user: UserPayload;
    }
  }
}

// Middleware function to authenticate an admin token
export const authenticateAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token not provided.' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    const admin = decoded as AdminPayload;
    req.admin = admin;

    next();
  });
};

// Middleware function to authenticate an employee token
export const authenticateEmployeeToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token not provided.' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    const employee = decoded as EmployeePayload;
    req.employee = employee;

    next();
  });
};

// Middleware function to authenticate a client token
export const authenticateClientToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token not provided.' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    const client = decoded as ClientPayload;
    req.client = client;

    next();
  });
};

// Middleware function to authenticate a user token
// export const authenticateUserToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token not provided.' });
//   }

//   jwt.verify(token, 'secret', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid token.' });
//     }

//     const user = decoded as UserPayload;
//     req.user = user;

//     next();
//   });
// };
