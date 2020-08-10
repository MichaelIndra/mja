import jwt from 'jsonwebtoken';

export const decodeToken = (token: string) => jwt.decode(token);
