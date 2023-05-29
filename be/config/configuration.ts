export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV,
  hostName: process.env.APP_HOSTNAME,
  port: parseInt(process.env.PORT, 10) || 4005,

  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
  },

  cryptSalt: parseInt(process.env.CRYPT_SALT),

  // avatar: {
  //   size: parseInt(process.env.AVATAR_SIZE),
  //   allowedFileTypes: `.(${process.env.AVATAR_ALLOWED_FILE_TYPES})`,
  // },
});
