// utils/userCache.ts

interface UserInfo {
  name: string;
  avatar: string;
}

const userCache = new Map<string, UserInfo>();

/**
 * Lấy thông tin người dùng từ cache nếu đã có
 * @param userId - ID người dùng
 * @returns UserInfo hoặc undefined
 */
export const getCachedUserInfo = (userId: string): UserInfo | undefined => {
  return userCache.get(userId);
};

/**
 * Lưu thông tin người dùng vào cache
 * @param userId - ID người dùng
 * @param info - Thông tin cần lưu: name và avatar
 */
export const setCachedUserInfo = (userId: string, info: UserInfo): void => {
  userCache.set(userId, info);
};

/**
 * Kiểm tra xem user đã có trong cache chưa
 * @param userId 
 * @returns boolean
 */
export const hasUserInfo = (userId: string): boolean => {
  return userCache.has(userId);
};

/**
 * Xóa thông tin 1 user cụ thể
 */
export const clearUserFromCache = (userId: string): void => {
  userCache.delete(userId);
};

/**
 * Xóa toàn bộ cache
 */
export const clearAllUserCache = (): void => {
  userCache.clear();
};
