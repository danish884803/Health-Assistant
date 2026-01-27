// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET;

// /* Create JWT */
// export function signJwt(user) {
//   return jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//       email: user.email,
//       fullName: user.fullName,
//       patientId: user.patientId,
//     },
//     JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// }

// /* Verify JWT */
// export function verifyToken(token) {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch {
//     throw new Error("Invalid token");
//   }
// }
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
