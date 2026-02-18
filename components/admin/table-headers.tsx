import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ============================================
// Order Table Headers
// ============================================

interface TableHeaderColumn {
  label: string;
  className?: string;
}

const ORDER_TABLE_COLUMNS: TableHeaderColumn[] = [
  { label: "Commande" },
  { label: "Client", className: "hidden sm:table-cell" },
  { label: "Articles", className: "hidden text-center md:table-cell" },
  { label: "Total", className: "hidden sm:table-cell" },
  { label: "Statut", className: "hidden sm:table-cell text-left" },
  { label: "Date", className: "hidden md:table-cell" },
];

export function OrderTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        {ORDER_TABLE_COLUMNS.map((column) => (
          <TableHead key={column.label} className={column.className}>
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

// ============================================
// Product/Inventory Table Headers
// ============================================

const PRODUCT_TABLE_COLUMNS: TableHeaderColumn[] = [
  { label: "Image", className: "hidden w-16 sm:table-cell" },
  { label: "Produit" },
  { label: "Prix TND", className: "hidden w-28 md:table-cell" },
  { label: "Modifier prix", className: "hidden w-32 lg:table-cell" },
  { label: "Stock", className: "hidden w-40 md:table-cell" },
  { label: "Vedette", className: "hidden w-16 lg:table-cell" },
  { label: "Actions", className: "hidden w-[140px] text-right sm:table-cell" },
];

export function ProductTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        {PRODUCT_TABLE_COLUMNS.map((column) => (
          <TableHead key={column.label} className={column.className}>
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
