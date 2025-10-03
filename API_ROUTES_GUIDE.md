# Next.js 15 API Routes Guide

This guide covers the API Routes implementation in this Next.js 15 project using the App Router.

## Overview

API Routes allow you to build RESTful APIs directly within your Next.js application. They are created as Route Handlers in the `app/api` directory.

## Project Structure

```
src/app/api/
├── users/
│   ├── route.ts          # GET, POST /api/users
│   └── [id]/
│       └── route.ts      # GET, DELETE, PATCH /api/users/[id]
```

## API Endpoints

### Users Collection (`/api/users`)

#### GET - Fetch All Users
```bash
curl http://localhost:3000/api/users
```

**Response:**
```json
{
  "data": [
    { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "Admin" },
    { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "User" }
  ],
  "count": 2
}
```

#### GET - Filter by Role
```bash
curl http://localhost:3000/api/users?role=Admin
```

**Response:**
```json
{
  "data": [
    { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "Admin" }
  ],
  "count": 1
}
```

#### POST - Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "role": "User"}'
```

**Response:**
```json
{
  "data": { "id": 4, "name": "John Doe", "email": "john@example.com", "role": "User" },
  "message": "User created successfully"
}
```

### Individual User (`/api/users/[id]`)

#### GET - Fetch User by ID
```bash
curl http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "data": { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "Admin" }
}
```

#### PATCH - Update User
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Williams"}'
```

**Response:**
```json
{
  "data": { "id": 1, "name": "Alice Williams", "email": "alice@example.com", "role": "Admin" },
  "message": "User updated successfully"
}
```

#### DELETE - Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Implementation Details

### Route Handler Structure

Route handlers export HTTP method functions (`GET`, `POST`, `PATCH`, `DELETE`, etc.):

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ data: body }, { status: 201 });
}
```

### Dynamic Routes

Dynamic route segments use `[param]` syntax:

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Use id...
}
```

**Note:** In Next.js 15, `params` is now a Promise and must be awaited.

### Query Parameters

Access query parameters via `searchParams`:

```typescript
const searchParams = request.nextUrl.searchParams;
const role = searchParams.get('role');
```

### Request Body

Parse JSON request body:

```typescript
const body = await request.json();
```

### Response Status Codes

```typescript
// Success with custom status
return NextResponse.json({ data }, { status: 201 });

// Error responses
return NextResponse.json({ error: 'Not found' }, { status: 404 });
return NextResponse.json({ error: 'Bad request' }, { status: 400 });
```

### Error Handling

```typescript
try {
  const body = await request.json();
  // Process request...
} catch (error) {
  return NextResponse.json(
    { error: 'Invalid request body' },
    { status: 400 }
  );
}
```

## Demo Page

Visit [http://localhost:3000/api-example](http://localhost:3000/api-example) to see a working example that demonstrates:

- Fetching all users
- Filtering users by role
- Creating new users
- Deleting users
- Error handling
- Loading states

### Key Features in Demo

1. **State Management** - Uses React `useState` for users, loading, and error states
2. **Async Operations** - All API calls use async/await with try/catch
3. **Form Handling** - Controlled form inputs with validation
4. **HTTP Methods** - Demonstrates GET, POST, and DELETE requests
5. **UI Feedback** - Loading states and error messages
6. **Dark Mode Support** - Tailwind CSS dark mode classes

## Client-Side API Consumption

### Fetch API

```typescript
// GET request
const response = await fetch('/api/users');
const data = await response.json();

// POST request
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
});

// DELETE request
const response = await fetch(`/api/users/${id}`, {
  method: 'DELETE',
});
```

### Error Handling

```typescript
try {
  const response = await fetch('/api/users');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  setUsers(data.data);
} catch (error) {
  setError('Failed to fetch users');
}
```

## Best Practices

1. **Validation** - Always validate input data before processing
2. **Error Handling** - Use try/catch and return appropriate status codes
3. **Type Safety** - Define TypeScript interfaces for request/response data
4. **Status Codes** - Use correct HTTP status codes (200, 201, 400, 404, etc.)
5. **Response Format** - Maintain consistent response structure across endpoints
6. **Async Operations** - Await promises properly (especially `params` in Next.js 15)

## Common HTTP Status Codes

- `200` - OK (successful GET, PATCH, DELETE)
- `201` - Created (successful POST)
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side error)

## Next Steps

1. Add database integration (PostgreSQL, MongoDB, etc.)
2. Implement authentication/authorization
3. Add request validation with Zod or similar
4. Set up API rate limiting
5. Add pagination for large datasets
6. Implement caching strategies

## Resources

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js API Reference](https://nextjs.org/docs/app/api-reference/functions/next-request)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
