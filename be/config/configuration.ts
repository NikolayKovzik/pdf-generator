export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV,
  hostName: process.env.HOST_NAME,
  port: parseInt(process.env.PORT, 10) || 4005,
  // jwt: {
  //   secret: process.env.JWT_SECRET,
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // },
});
