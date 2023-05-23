import authExceptions from './swagger-exceptions';

const { Unauthorized, Forbidden, InvalidBodyBadRequest } = authExceptions;

const authResponses = {
  UnauthorizedResponse: {
    schema: {
      type: 'object',
      example: Unauthorized,
    },
  },
  ForbiddenResponse: {
    schema: {
      type: 'object',
      example: Forbidden,
    },
  },
  login: {
    ApiBadRequestResponse: {
      schema: {
        type: 'object',
        example: InvalidBodyBadRequest,
      },
      description: 'Invalid body',
    },
    ApiOkResponse: {
      schema: {
        type: 'object',
        example: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MGI2MDAzNDkzYWZlYWQyNjFiNWUyNiIsImVtYWlsIjoiaGFuc0BtYWlsLnJ1IiwidXNlcm5hbWUiOiJIYW5zIiwiYWNjZXNzIjp7IlVzZXJzIjpbInJlYWQiXSwiRGF5Y2F0aW9uIjpbInJlYWQiXSwiSG90ZWwgUGFzc2VzIjpbInJlYWQiXSwiTW9tZW50cyI6WyJyZWFkIl0sIlByb21vdGlvbnMiOlsicmVhZCJdfSwiaWF0IjoxNjc4NTMzMDk5LCJleHAiOjE2Nzg1MzQ4OTl9.Yatn7NXGZ78yzH8Ayuw1YNYq6fgwREd4EJylN83MYkE',
        },
      },
    },
  },

  registration: {
    ApiCreatedResponse: {
      schema: {
        type: 'object',
        example: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MGI2MDAzNDkzYWZlYWQyNjFiNWUyNiIsImVtYWlsIjoiaGFuc0BtYWlsLnJ1IiwidXNlcm5hbWUiOiJIYW5zIiwiYWNjZXNzIjp7IlVzZXJzIjpbInJlYWQiXSwiRGF5Y2F0aW9uIjpbInJlYWQiXSwiSG90ZWwgUGFzc2VzIjpbInJlYWQiXSwiTW9tZW50cyI6WyJyZWFkIl0sIlByb21vdGlvbnMiOlsicmVhZCJdfSwiaWF0IjoxNjc4NTMzMDk5LCJleHAiOjE2Nzg1MzQ4OTl9.Yatn7NXGZ78yzH8Ayuw1YNYq6fgwREd4EJylN83MYkE',
        },
      },
    },
  },
};

export default authResponses;
