import JWT, { SignOptions, Secret } from 'jsonwebtoken';

const generateToken = async (
  userInfo: string | object,
  secretSignature: Secret,
  tokenLife: string
): Promise<string> => {
  try {
    
    return JWT.sign({ userInfo }, secretSignature, {algorithm: 'HS256', expiresIn: tokenLife} as SignOptions);
  } catch (error) {
    throw new Error('Error generating token');
  }
};

const verifyToken = async (token: string, secretSignature: Secret) => {
  try {
    return JWT.verify(token, secretSignature);
  } catch (error) {
    throw new Error('Error verifying token');
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
