/**
 * Hàm tách token khỏi chuỗi Authorization: Bearer <token>
 * @param authHeader Chuỗi header Authorization
 * @returns token string hoặc null nếu không hợp lệ
 */
export const extractBearerToken = (authHeader: string | undefined | null): string | null => {
    if (!authHeader) return null;
    return authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
  };
  