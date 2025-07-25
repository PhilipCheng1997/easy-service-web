const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateShortId(length = 8) {
  let result = '';
  for (let i = 0; i < length; i++) {
    // 从chars中随机选一个字符
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export { generateShortId };
