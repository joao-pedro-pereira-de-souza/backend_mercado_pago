const config = {
  redis: {
    host: process.env.DB_REDIS_HOST,
    port: Number(process.env.DB_REDIS_PORT),
    password: process.env.DB_REDIS_PASSWORD,
  },
};

export default config;
