const DEFAULT_ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

function normalizeOrigin(value) {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed === "null") return null;

  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins() {
  const envOrigins = [
    process.env.FRONTEND_ORIGIN,
    process.env.CLIENT_ORIGIN,
    process.env.ALLOWED_ORIGIN,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins]);
}

export function verifyOriginOrReferer(req, res, next) {
  const requestOrigin = normalizeOrigin(req.get("origin"));
  const refererOrigin = normalizeOrigin(req.get("referer"));
  const allowedOrigins = getAllowedOrigins();
  const currentOrigin = normalizeOrigin(`${req.protocol}://${req.get("host")}`);

  const candidateOrigin = requestOrigin || refererOrigin;

  if (!candidateOrigin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (
    candidateOrigin !== currentOrigin &&
    !allowedOrigins.has(candidateOrigin)
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}
