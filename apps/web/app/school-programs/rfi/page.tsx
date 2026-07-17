"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RFIResponse } from "@asd/domain";
import { useRFIStore } from "@asd/ui/src/store/rfiStore";
import { fetchRFI } from "@asd/services";
import RFIForm from "@asd/ui/src/components/rfi/RFIForm";

export default function RFIPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { queue, currentProgram } = useRFIStore();
  const [rfiResponse, setRfiResponse] = useState<RFIResponse | null>(null);

  const parentPath = pathname.replace("/rfi", "");

  useEffect(() => {
    if (!currentProgram) {
      router.push(parentPath);
      return;
    }

    fetchRFI("/api/rfi", { programId: currentProgram.programId, marketContext: "", s: "" })
      .then(setRfiResponse);
  }, [currentProgram, router]);

  if (!currentProgram || !rfiResponse) return null;

  return (
    <RFIForm
      response={rfiResponse}
      programs={queue}
      submitUrl="/api/rfi"
      onComplete={() => router.push(parentPath)}
      onProgramChange={() => {}}
      onProgramSkip={() => {}}
    />
  );
}
