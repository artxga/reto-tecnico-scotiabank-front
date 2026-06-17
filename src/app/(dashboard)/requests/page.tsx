import { Suspense } from "react";
import { RequestsSkeleton } from "@/components/requests/requests-skeleton";
import { RequestsList } from "@/components/requests/requests-list";

export default function RequestsPage() {
  return (
    <Suspense fallback={<RequestsSkeleton />}>
      <RequestsList />
    </Suspense>
  );
}
