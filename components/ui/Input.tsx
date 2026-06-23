export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
        {...props}
        suppressHydrationWarning // Add this
    />
);
