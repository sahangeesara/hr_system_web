export interface Payroll {
    id: string;
    employee_id: string;
    month: number;
    year: number;
    basic_salary: number;
    allowances: number;
    deductions: number;
    net_salary: number;
    payment_status: 'PENDING' | 'PAID' | 'FAILED';
    updated_at: string;
}
