import jwt from "jsonwebtoken";

/**
 * Decodes the JWT token from cookies to retrieve user information.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Object} - Decoded user data or null if not authenticated.
 */
export function getUserFromToken(req) {
  const token = req.cookies.get("token");

  if (!token) return null;

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token.value, process.env.TOKEN_SECRET);
    return decoded; // Contains id, username, and email
  } catch (error) {
    console.error("Invalid or expired token");
    return null;
  }
}
