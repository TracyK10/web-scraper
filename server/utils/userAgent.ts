import dotenv from 'dotenv';
dotenv.config();

const userAgents = process.env.USER_AGENT?.split(',') ?? [];

export function getRandomUserAgent(): string {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}