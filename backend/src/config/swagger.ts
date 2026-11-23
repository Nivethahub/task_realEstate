import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const spec = {
  openapi: '3.0.3',
  info: { title: 'Real Estate Listing API', version: '1.0.0', description: 'REST API for property listings, authentication, search and inquiries.' },
  servers: [{ url: 'http://localhost:5000/api', description: 'Local development' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      PropertyInput: { type: 'object', required: ['title', 'description', 'city', 'locality', 'address', 'price', 'bedrooms', 'bathrooms', 'areaSqft', 'propertyType'], properties: {
        title: { type: 'string', example: 'Bright 2 BHK apartment near metro' }, description: { type: 'string' }, city: { type: 'string', example: 'Chennai' }, locality: { type: 'string', example: 'Velachery' }, address: { type: 'string' }, price: { type: 'number', example: 8500000 }, bedrooms: { type: 'integer', example: 2 }, bathrooms: { type: 'integer', example: 2 }, areaSqft: { type: 'integer', example: 1150 }, propertyType: { type: 'string', enum: ['APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'PLOT', 'COMMERCIAL'] }, listingType: { type: 'string', enum: ['SALE', 'RENT'] }, images: { type: 'array', items: { type: 'string', format: 'uri' } }, amenities: { type: 'array', items: { type: 'string' } },
      } },
    },
  },
  paths: {
    '/auth/register': { post: { tags: ['Authentication'], summary: 'Register a user', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 }, phone: { type: 'string' } } } } } }, responses: { '201': { description: 'Account created' }, '409': { description: 'Email already registered' } } } },
    '/auth/login': { post: { tags: ['Authentication'], summary: 'Login and receive JWT', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { '200': { description: 'Login successful' }, '401': { description: 'Invalid credentials' } } } },
    '/auth/refresh': { post: { tags: ['Authentication'], summary: 'Rotate refresh token', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } } } } }, responses: { '200': { description: 'New access and refresh tokens' }, '401': { description: 'Invalid or expired refresh token' } } } },
    '/auth/logout': { post: { tags: ['Authentication'], summary: 'Revoke refresh token', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } } } } }, responses: { '200': { description: 'Logged out' } } } },
    '/auth/me': { get: { tags: ['Authentication'], summary: 'Get current user', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Current user' } } } },
    '/properties': {
      get: { tags: ['Properties'], summary: 'Search and paginate properties', parameters: [
        { in: 'query', name: 'city', schema: { type: 'string' } }, { in: 'query', name: 'q', schema: { type: 'string' } },
        { in: 'query', name: 'minPrice', schema: { type: 'number' } }, { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
        { in: 'query', name: 'propertyType', schema: { type: 'string', enum: ['APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'PLOT', 'COMMERCIAL'] } },
        { in: 'query', name: 'bedrooms', schema: { type: 'integer' } }, { in: 'query', name: 'listingType', schema: { type: 'string', enum: ['SALE', 'RENT'] } },
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', default: 12, maximum: 50 } },
        { in: 'query', name: 'sortBy', schema: { type: 'string', enum: ['price', 'createdAt'] } }, { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'] } },
      ], responses: { '200': { description: 'Property results and pagination metadata' } } },
      post: { tags: ['Properties'], summary: 'Create a property listing', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PropertyInput' } } } }, responses: { '201': { description: 'Property created' }, '401': { description: 'Authentication required' } } },
    },
    '/properties/mine': { get: { tags: ['Properties'], summary: 'List current user properties', security: [{ bearerAuth: [] }], responses: { '200': { description: 'User listings' } } } },
    '/properties/{id}': {
      get: { tags: ['Properties'], summary: 'Get property details', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '200': { description: 'Property details' }, '404': { description: 'Not found' } } },
      patch: { tags: ['Properties'], summary: 'Update own property', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PropertyInput' } } } }, responses: { '200': { description: 'Updated' }, '403': { description: 'Not the owner' } } },
      delete: { tags: ['Properties'], summary: 'Delete own property', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '200': { description: 'Deleted' }, '403': { description: 'Not the owner' } } },
    },
    '/properties/{id}/similar': { get: { tags: ['Properties'], summary: 'Get similar listings', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { '200': { description: 'Similar properties' } } } },
    '/inquiries/mine': { get: { tags: ['Inquiries'], summary: 'Get inquiries I sent', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Inquiry list' } } } },
    '/inquiries/received': { get: { tags: ['Inquiries'], summary: 'Get inquiries received for my listings', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Owner lead inbox' } } } },
    '/inquiries/{propertyId}': { post: { tags: ['Inquiries'], summary: 'Contact a property owner', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'propertyId', required: true, schema: { type: 'string', format: 'uuid' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['message'], properties: { message: { type: 'string', minLength: 10, maxLength: 1000 } } } } } }, responses: { '201': { description: 'Inquiry created' }, '409': { description: 'Duplicate inquiry' } } } },
  },
};

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
  app.get('/api-docs.json', (_req, res) => res.json(spec));
}
