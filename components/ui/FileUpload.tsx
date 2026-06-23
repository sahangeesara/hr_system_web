export const FileUpload = ({ onChange }: { onChange: (file: File) => void }) => (
    <input
        type="file"
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
        className="block w-full text-body file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white"
    />
);
