import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to InfiniDev
        </h1>
        <p className="text-muted-foreground text-lg">
          Empowering Innovation Through Technology
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <Link
          href="/login"
          className="px-6 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-[var(--radius)] hover:bg-primary/90 transition-colors text-center"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 text-lg font-semibold text-accent-foreground bg-accent rounded-[var(--radius)] border-2 border-border hover:bg-accent/90 transition-colors text-center"
        >
          Register
        </Link>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        © 2024 InfiniDev. All rights reserved.
      </div>
    </div>
  );
}
