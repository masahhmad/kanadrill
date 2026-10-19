export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-[15px] p-5 text-[#3a2e2b]">
      {children}
    </main>
  );
}
