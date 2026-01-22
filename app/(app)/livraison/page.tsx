import { Metadata } from "next";
import { Truck, MapPin, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Livraison & Expédition | Dodo Nutrition",
  description: "Informations sur la livraison de vos suppléments partout en Tunisie.",
};

export default function LivraisonPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Livraison & Expédition
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Nous livrons vos suppléments rapidement et en toute sécurité partout en Tunisie.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-dodo-yellow/10 rounded-full">
                <Truck className="h-6 w-6 text-dodo-yellow" />
              </div>
              <CardTitle>Zones de Livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nous assurons la livraison sur <strong>tout le territoire tunisien</strong> (24 gouvernorats). Que vous soyez à Tunis, Sfax, Sousse, ou ailleurs, nous venons à vous.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-dodo-yellow/10 rounded-full">
                <Clock className="h-6 w-6 text-dodo-yellow" />
              </div>
              <CardTitle>Délais d'Expédition</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Grand Tunis :</strong> 24h ouvrables</li>
                <li><strong>Autres régions :</strong> 24h à 48h ouvrables</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-dodo-yellow/10 rounded-full">
                <MapPin className="h-6 w-6 text-dodo-yellow" />
              </div>
              <CardTitle>Frais de Livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les frais de livraison sont fixes : <strong>7 DT</strong> pour toute la Tunisie.
                <br />
                <span className="text-dodo-yellow font-medium">Livraison gratuite</span> pour toute commande supérieure à 300 DT.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-dodo-yellow/10 rounded-full">
                <AlertCircle className="h-6 w-6 text-dodo-yellow" />
              </div>
              <CardTitle>Suivi de Commande</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Une fois votre commande expédiée, vous recevrez un appel ou un SMS de confirmation. Vous pouvez également suivre l'état de votre commande dans votre espace "Mes Commandes".
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
