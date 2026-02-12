import { redirect } from "next/navigation";
import { CODSuccessClient } from "./CODSuccessClient";

export const metadata = {
  title: "Commande Confirmée | Dodo Nutrition",
  description: "Votre commande a été passée avec succès",
};

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; total?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  
  const orderNumber = params.order;
  const total = params.total ? parseFloat(params.total) : undefined;
  
  // If no order number, redirect home
  if (!orderNumber) {
    redirect("/");
  }

  return <CODSuccessClient orderNumber={orderNumber} total={total} />;
}
