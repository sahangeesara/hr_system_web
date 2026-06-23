export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border ${className}`}>{children}</div>
);
