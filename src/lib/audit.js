import AuditLog from "@/models/AuditLog";

export async function logAudit({
  actorId,
  actorModel = "Doctor",
  action,
  targetType,
  targetId = null,
  metadata = {},
  req,
}) {
  try {
    await AuditLog.create({
      actorId,
      actorModel,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress: req?.headers.get("x-forwarded-for") || "unknown",
      userAgent: req?.headers.get("user-agent") || "unknown",
    });
  } catch (err) {
    console.error("AUDIT LOG ERROR:", err);
  }
}
