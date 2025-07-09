// src/types/jspdf-autotable.d.ts
import "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable?: {
      finalY?: number;
      // You can add more properties if needed
    };
  }
}
