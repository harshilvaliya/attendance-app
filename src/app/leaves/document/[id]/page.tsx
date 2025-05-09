import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getLeaveRequestsData } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DocumentPage({ params }: { params: { id: string } }) {
  const leaveData = getLeaveRequestsData();
  const request = [
    ...leaveData.pending,
    ...leaveData.approved,
    ...leaveData.rejected,
  ].find((r) => r.id === parseInt(params.id));

  if (!request || !request.document) {
    notFound();
  }

  const isImage =
    request.document.endsWith(".jpg") || request.document.endsWith(".png");
  const isPDF = request.document.endsWith(".pdf");

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/leaves">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Document Viewer</h1>
            <p className="text-muted-foreground">
              Viewing document for {request.employee}'s {request.type} request
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          {isImage && (
            <Image
              src={request.document}
              alt={`Document for ${request.employee}'s leave request`}
              className="max-w-full h-auto"
            />
          )}
          {isPDF && (
            <iframe
              src={request.document}
              className="w-full h-[80vh]"
              title={`Document for ${request.employee}'s leave request`}
            />
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
