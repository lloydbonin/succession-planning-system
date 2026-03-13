type SummaryCardProps = {
  label: string;
  value: string | number;
};

export default function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-800">{value}</h2>
    </div>
  );
}