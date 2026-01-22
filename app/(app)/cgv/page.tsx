import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente (CGV) | Dodo Nutrition",
  description: "Conditions générales de vente et d'utilisation du site Dodo Nutrition.",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose dark:prose-invert">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl text-center mb-8">
          Conditions Générales de Vente
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
          <p className="text-muted-foreground">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Dodo Nutrition et toute personne passant commande sur le site dodonutrition.tn.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Produits</h2>
          <p className="text-muted-foreground">
            Les produits proposés à la vente sont ceux décrits sur le site. Dodo Nutrition apporte le plus grand soin à la présentation et à la description de ces produits pour satisfaire au mieux l'information du client.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Prix</h2>
          <p className="text-muted-foreground">
            Les prix de nos produits sont indiqués en Dinars Tunisiens (TND) toutes taxes comprises (TTC), hors participation aux frais de traitement et d'expédition.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Commande</h2>
          <p className="text-muted-foreground">
            Toute commande figure sur le site suppose l'adhésion aux présentes Conditions Générales. La confirmation de commande entraîne acceptation des présentes conditions de vente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Paiement</h2>
          <p className="text-muted-foreground">
            Le paiement est exigible immédiatement à la commande, ou à la livraison selon le mode choisi. Le paiement à la livraison se fait en espèces uniquement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Livraison</h2>
          <p className="text-muted-foreground">
            Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande. Les délais indiqués sont des délais moyens habituels et correspondent aux délais de traitement et de livraison.
          </p>
        </section>
      </div>
    </div>
  );
}
