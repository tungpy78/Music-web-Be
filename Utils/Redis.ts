import Redis from 'ioredis';
const redis = new Redis();

const saveOTP = async (email: string, otp: string, expireSeconds = 300) => {
  await redis.set(`otp:${email}`, otp, 'EX', expireSeconds);
};

const getOTP = async (email: string): Promise<string | null> => {
  return redis.get(`otp:${email}`);
};

const deleteOTP = async (email: string) => {
  await redis.del(`otp:${email}`);
};

export const RedisService = {
  saveOTP,
  getOTP,
  deleteOTP
};
