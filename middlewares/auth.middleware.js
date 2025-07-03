export function validatePermissions(user, allowedRoles) {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
}
// ... otros middlewares ... 