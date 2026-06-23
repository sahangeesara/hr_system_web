export const StatusBadge = ({ status }: { status: string }) => {
    const color = status === 'ACTIVE' ? 'bg-success' : 'bg-warning';
    return <span className={`px-2 py-1 rounded-full text-caption text-white ${color}`}>{status}</span>;
};
