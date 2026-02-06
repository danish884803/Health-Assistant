import jwt from "jsonwebtoken";
export { jwt }; 
const JWT_SECRET = process.env.JWT_SECRET;

export function signJwt(user) {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  if (user.role === "patient") {
    payload.fullName = user.fullName;
    payload.patientId = user.patientId;
  }

  if (user.role === "doctor") {
    payload.name = user.name;
  }

  if (user.role === "admin") {
    payload.fullName = user.fullName; 
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
