import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInvoices } from "@/lib/actions/admin-data";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  pending: { label: "En attente", variant: "secondary" },
  paid: { label: "Pay\u00e9e", variant: "default" },
  overdue: { label: "En retard", variant: "destructive" },
};

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dodo-yellow/10">
            <FileText className="h-5 w-5 text-dodo-yellow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Factures</h1>
            <p className="text-sm text-muted-foreground">
              {invoices.length} facture{invoices.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-dodo-yellow hover:bg-dodo-yellow/90 text-black"
        >
          <Link href="/studio/structure/invoice">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Link>
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold text-foreground">
            Aucune facture
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cr&eacute;ez votre premi&egrave;re facture depuis Sanity Studio.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  N&deg; Facture
                </th>
                <th className="hidden px-4 py-3 text-sm font-medium text-muted-foreground sm:table-cell">
                  Fournisseur
                </th>
                <th className="hidden px-4 py-3 text-sm font-medium text-muted-foreground md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  Statut
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => {
                const config = STATUS_CONFIG[invoice.status] ?? {
                  label: invoice.status,
                  variant: "secondary" as const,
                };
                return (
                  <tr
                    key={invoice._id}
                    className="bg-card transition-colors hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-foreground">
                        {invoice.invoiceNumber}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({invoice.itemCount} article
                        {invoice.itemCount !== 1 ? "s" : ""})
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                      {invoice.supplierName ?? "\u2014"}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                      {formatDate(invoice.date, "long", "\u2014")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                      {invoice.totalAmount != null
                        ? formatPrice(invoice.totalAmount)
                        : "\u2014"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
