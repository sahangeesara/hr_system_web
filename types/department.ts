export interface Department {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string; // ISO Date string
    updated_at: string; // ISO Date string
}
