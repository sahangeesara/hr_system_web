export interface Employee {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    department_id: string;
    position_id: string;
    status: 'ACTIVE' | 'INACTIVE' | 'ONBOARDING' | 'TERMINATED';
    joining_date: string;
}

export interface EmployeeDocument {
    id: string;
    employee_id: string;
    document_type: string;
    original_file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_at: string;
}
