export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV,
  hostName: process.env.HOST_NAME,
  port: parseInt(process.env.PORT, 10) || 4005,
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
  // jwt: {
  //   secret: process.env.JWT_SECRET,
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // },
});
