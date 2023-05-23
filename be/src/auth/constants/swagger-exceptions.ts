const authExceptions = {
  Unauthorized: {
    status: 401,
    message: 'User is not authorized',
    error: 'Unauthorized',
  },
  Forbidden: {
    status: 403,
    message: 'Forbidden resource',
    error: 'Forbidden',
  },
  InvalidBodyBadRequest: {
    status: 400,
    message: [
      'password: password must be longer than or equal to 4 characters, password should not be empty',
      'email: email must be an email',
    ],
    error: 'Bad Request',
  },
};

export default authExceptions;
