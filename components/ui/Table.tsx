interface TableProps { headers: string[]; children: React.ReactNode; }
export const Table = ({ headers, children }: TableProps) => (
    <table className="w-full border-collapse">
        <thead>
        <tr className="bg-surface border-b">
            {headers.map(h => <th key={h} className="p-3 text-left font-semibold">{h}</th>)}
        </tr>
        </thead>
        <tbody>{children}</tbody>
    </table>
);
