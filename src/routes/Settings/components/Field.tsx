export default function Field({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <div className="flex justify-between gap-2 max-md:flex-col md:h-8.5 md:items-center">
      <span>{label}</span>

      {children}
    </div>
  );
}
