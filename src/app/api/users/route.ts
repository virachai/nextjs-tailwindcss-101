import { NextRequest, NextResponse } from 'next/server';

// Sample data
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
];

// GET /api/users - Get all users or filter by query params
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');

  if (role) {
    const filtered = users.filter((user) => user.role.toLowerCase() === role.toLowerCase());
    return NextResponse.json({ data: filtered, count: filtered.length });
  }

  return NextResponse.json({ data: users, count: users.length });
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      role: role || 'User',
    };

    users.push(newUser);

    return NextResponse.json({ data: newUser, message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
