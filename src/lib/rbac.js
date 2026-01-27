export function enforceRBAC(session, allowedRoles, requireMFA = false) {
  if (!session) throw new Error("Unauthorized");

  if (!allowedRoles.includes(session.user.role))
    throw new Error("Forbidden");

  if (requireMFA && !session.user.mfaVerified)
    throw new Error("MFA required");
}
