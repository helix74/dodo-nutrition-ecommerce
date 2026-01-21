import { redirect } from "next/navigation";
import { CODSuccessClient } from "./CODSuccessClient";

export const metadata = {
  title: "Commande Confirmée | Dodo Nutrition",
  description: "Votre commande a été passée avec succès",
};

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; total?: string; session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  
  // Support both COD (order param) and Stripe (session_id param)
  const orderNumber = params.order;
  const total = params.total ? parseFloat(params.total) : undefined;
  
  // If no order number and no session_id, redirect home
  if (!orderNumber && !params.session_id) {
    redirect("/");
  }

  // For Stripe sessions, we could still use the old flow
  // For now, only support COD
  if (!orderNumber) {
    redirect("/");
  }

  return <CODSuccessClient orderNumber={orderNumber} total={total} />;
}
