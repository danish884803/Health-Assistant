import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

/* =========================
   SIGN TOKEN
========================= */
export function signJwt(payload) {
  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* =========================
   VERIFY TOKEN
========================= */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
