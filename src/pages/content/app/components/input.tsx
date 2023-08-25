export default function Input({ value, setValue, ...props }: any) {
  return (
    <input
      {...props}
      value={value}
      onChange={(v) => {
        if (setValue) setValue(v.target?.value);
      }}
      className="w-full appearance-none rounded-md border border-slate-400 bg-transparent uppercase text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-7 p-1 font-medium"
    />
  );
}
