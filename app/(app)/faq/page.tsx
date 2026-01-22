import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Questions Fréquentes | Dodo Nutrition",
  description: "Réponses à vos questions sur les commandes, la livraison, et nos produits.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl text-center mb-8">
          Questions Fréquentes (FAQ)
        </h1>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Comment passer une commande ?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              C'est simple ! Ajoutez les produits à votre panier, cliquez sur "Commander", remplissez vos informations de livraison, et validez. Vous paierez à la livraison.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Quels sont les délais de livraison ?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Nous livrons généralement sous 24 à 48 heures ouvrables partout en Tunisie.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Comment payer ma commande ?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Le paiement se fait uniquement à la livraison (Cash on Delivery). Vous payez en espèces directement au livreur.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Les produits sont-ils originaux ?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolument. Tous nos produits sont 100% authentiques et importés directement des fabricants ou distributeurs agréés.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-4" id="retours">
            <AccordionTrigger className="text-lg font-medium">
              Puis-je retourner un produit ?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Oui, si le produit est scellé et non ouvert, vous pouvez le retourner sous 7 jours. Contactez notre service client pour la procédure.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
