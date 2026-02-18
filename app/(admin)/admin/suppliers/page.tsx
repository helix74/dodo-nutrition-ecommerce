import Link from "next/link";
import { Users, Plus, Phone, Mail, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSuppliers } from "@/lib/actions/admin-data";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dodo-yellow/10">
            <Users className="h-5 w-5 text-dodo-yellow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fournisseurs</h1>
            <p className="text-sm text-muted-foreground">
              {suppliers.length} fournisseur{suppliers.length !== 1 ? "s" : ""}{" "}
              enregistr&eacute;{suppliers.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-dodo-yellow hover:bg-dodo-yellow/90 text-black"
        >
          <Link href="/studio/structure/supplier">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un fournisseur
          </Link>
        </Button>
      </div>

      {suppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold text-foreground">
            Aucun fournisseur
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajoutez votre premier fournisseur depuis Sanity Studio.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  Nom
                </th>
                <th className="hidden px-4 py-3 text-sm font-medium text-muted-foreground sm:table-cell">
                  Contact
                </th>
                <th className="hidden px-4 py-3 text-sm font-medium text-muted-foreground md:table-cell">
                  Telephone
                </th>
                <th className="hidden px-4 py-3 text-sm font-medium text-muted-foreground lg:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Produits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {suppliers.map((supplier) => (
                <tr
                  key={supplier._id}
                  className="bg-card transition-colors hover:bg-secondary/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {supplier.name}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {supplier.contactName ?? "\u2014"}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {supplier.phone ? (
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {supplier.phone}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {"\u2014"}
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {supplier.email ? (
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {supplier.email}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {"\u2014"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant="secondary" className="gap-1">
                      <Package className="h-3 w-3" />
                      {supplier.productCount}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
