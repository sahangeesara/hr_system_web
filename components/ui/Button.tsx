interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'secondary';
}
export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
    const base = "px-4 py-2 rounded-md font-medium transition-colors";
    const variants = {
        primary: "bg-primary text-white hover:bg-opacity-90",
        danger: "bg-danger text-white hover:bg-opacity-90",
        secondary: "bg-secondary text-white hover:bg-opacity-90"
    };
    return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};
