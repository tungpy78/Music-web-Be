import Redis from 'ioredis';
import dotenv from 'dotenv';
// const redis = new Redis(
//     {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: Number(process.env.REDIS_PORT) || 6379,
//   });
dotenv.config();

const redis = new Redis(process.env.REDIS_URL || "rediss://default:AfrbAAIncDE3ZjFkZjVhMjQ5YjA0ZGRlODc0OTE1MjE5M2IwZTA2ZHAxNjQyMTk@touching-tarpon-64219.upstash.io:6379");

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
