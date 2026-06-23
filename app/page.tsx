import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function WelcomePage() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
          <h1 className="text-heading font-bold text-primary mb-4">
            HRM System
          </h1>
          <p className="text-body text-secondary mb-8">
            Streamline your workforce management, payroll, and onboarding with our all-in-one HR solution.
          </p>

          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full">Login to System</Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" className="w-full">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
  );
}
