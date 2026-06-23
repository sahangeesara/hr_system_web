# HR Management System

A modern, full-stack Human Resources Management System built with Next.js 16, React 19, TypeScript, and Supabase.

## Features

### 🔐 Authentication
- User registration with email verification
- Secure login/logout with Supabase Auth
- Protected dashboard routes
- Session management

### 👥 Employee Management
- Complete CRUD operations for employees
- Employee profile management
- Document upload and management
- Employee search and filtering

### 🏢 Department Management
- Create, read, update, and delete departments
- Department listing with details
- Associate employees with departments

### 💼 Position Management
- Manage job positions
- CRUD operations for positions
- Link positions to employees

### 📊 Dashboard
- Overview of HR metrics
- Quick access to all modules
- Real-time data updates

## Tech Stack

- **Framework**: Next.js 16.2.9 (App Router)
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database & Auth**: Supabase
- **Notifications**: SweetAlert2
- **Form Handling**: React Hooks

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18.x or higher
- npm or yarn package manager
- A Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr_system_web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create departments table
   CREATE TABLE departments (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     description TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create positions table
   CREATE TABLE positions (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     department_id INTEGER REFERENCES departments(id),
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create employees table
   CREATE TABLE employees (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     full_name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     phone VARCHAR(50),
     department_id INTEGER REFERENCES departments(id),
     position_id INTEGER REFERENCES positions(id),
     hire_date DATE,
     status VARCHAR(50) DEFAULT 'active',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create employee_documents table
   CREATE TABLE employee_documents (
     id SERIAL PRIMARY KEY,
     employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
     document_name VARCHAR(255) NOT NULL,
     document_type VARCHAR(100),
     file_url TEXT NOT NULL,
     uploaded_at TIMESTAMP DEFAULT NOW()
   );

   -- Create profiles table (linked to auth.users)
   CREATE TABLE profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     full_name VARCHAR(255),
     email VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Trigger to auto-create profile on user signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, full_name, email)
     VALUES (
       NEW.id,
       NEW.raw_user_meta_data->>'full_name',
       NEW.email
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW
     EXECUTE FUNCTION public.handle_new_user();
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
hr_system_web/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── (dashboard)/
│   │   ├── dashboard/      # Main dashboard
│   │   ├── departments/    # Department management
│   │   ├── employees/      # Employee management
│   │   └── positions/      # Position management
│   ├── api/
│   │   ├── departments/    # Department API routes
│   │   ├── employees/      # Employee API routes
│   │   └── positions/      # Position API routes
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/
│   ├── departments/
│   │   └── DepartmentModal.tsx
│   ├── layout/
│   │   └── Navbar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── types/
│   └── department.ts       # TypeScript type definitions
└── package.json
```

## API Routes

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create a new department
- `PUT /api/departments/[id]` - Update a department
- `DELETE /api/departments/[id]` - Delete a department

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/[id]` - Update an employee
- `DELETE /api/employees/[id]` - Delete an employee
- `GET /api/employees/documents/[document_id]/download` - Download employee document

### Positions
- `GET /api/positions` - Get all positions
- `POST /api/positions` - Create a new position
- `PUT /api/positions/[id]` - Update a position
- `DELETE /api/positions/[id]` - Delete a position

## Available Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Features in Detail

### Employee Management
- Add new employees with complete profile information
- Update employee details including department and position
- Upload and manage employee documents
- Track employee status (active/inactive)
- Download employee documents

### Department Management
- Create departments with name and description
- Edit existing departments
- Delete departments (with confirmation)
- View all departments in a table format

### Position Management
- Define job positions
- Link positions to departments
- Manage position details

## Security

- Authentication handled by Supabase Auth
- Row Level Security (RLS) policies on Supabase
- Protected API routes
- Secure file uploads to Supabase Storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ by the Erabiz Team**
