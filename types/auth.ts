export type UserRole = 'ADMIN' | 'HR' | 'EMPLOYEE';

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
    full_name: string;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
}
