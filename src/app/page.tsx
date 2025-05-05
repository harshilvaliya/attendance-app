import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="flex flex-col gap-4">
        <Link
          href="/admin-dashboard"
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Admin Dashboard
        </Link>
        <Link
          href="/user-leave"
          className="px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          User Dashboard
        </Link>
      </div>
    </div>
  );
}
