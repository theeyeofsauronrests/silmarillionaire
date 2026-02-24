"use client";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button type="button" variant="secondary" onClick={() => window.print()} className="no-print">
      Print to PDF
    </Button>
  );
}
