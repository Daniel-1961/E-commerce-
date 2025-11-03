import jwt from 'jsonwebtoken';

function generateToken(user) {
  const JWT_EXPIRES_IN = '1d';
  const JWT_SECRET = 'super_secure_256bit_key_here';

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const options = {
    expiresIn: JWT_EXPIRES_IN
  };

  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
}

// Example usage
const user = {
  id: 123,
  email: 'daniel@example.com',
  role: 'customer'
};

const token = generateToken(user);
console.log('Generated JWT:', token);
