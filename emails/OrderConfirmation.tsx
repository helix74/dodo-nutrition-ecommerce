import {
  Column,
  Heading,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import Layout from "./components/Layout";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderConfirmationProps {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
}

export const OrderConfirmation = ({
  customerName = "Client",
  orderId = "CMD-123456",
  items = [
    {
      name: "Whey Protein Isolate - Vanille",
      quantity: 1,
      price: 189,
      image: "https://cdn.sanity.io/images/q8511b3m/production/2f713a7a5215e0181508c5f499695487d6f56281-235x64.png", // Placeholder
    },
  ],
  total = 189,
  shippingAddress = "123 Rue de la République, 1000 Tunis",
}: OrderConfirmationProps) => {
  return (
    <Layout preview={`Confirmation de commande #${orderId}`}>
      <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal text-foreground">
        Merci pour votre commande !
      </Heading>
      <Text className="text-base leading-6 text-zinc-300">
        Bonjour {customerName},
      </Text>
      <Text className="text-base leading-6 text-zinc-300">
        Nous avons bien reçu votre commande et nous la préparons avec soin. Voici un récapitulatif de vos achats.
      </Text>

      <Section className="my-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <Text className="mt-0 mb-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          Commande #{orderId}
        </Text>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Row key={index} className={isLast ? "" : "mb-4 border-b border-zinc-800 pb-4"}>
              <Column className="w-16 pr-4">
                {item.image && (
                  <Img
                    src={item.image}
                    alt={item.name}
                    width="64"
                    height="64"
                    className="rounded-md object-cover"
                  />
                )}
              </Column>
              <Column>
                <Text className="m-0 text-sm font-medium text-foreground">
                  {item.name}
                </Text>
                <Text className="m-0 text-xs text-zinc-400">
                  Qté: {item.quantity}
                </Text>
              </Column>
              <Column className="text-right">
                <Text className="m-0 text-sm font-medium text-primary">
                  {item.price.toFixed(2)} TND
                </Text>
              </Column>
            </Row>
          );
        })}

        <Row className="mt-4 pt-4 border-t border-zinc-700">
          <Column>
            <Text className="m-0 text-base font-bold text-foreground">Total</Text>
          </Column>
          <Column className="text-right">
            <Text className="m-0 text-xl font-bold text-primary">
              {total.toFixed(2)} TND
            </Text>
          </Column>
        </Row>
      </Section>

      <Section className="mb-8">
        <Text className="mb-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          Adresse de livraison
        </Text>
        <Text className="m-0 text-base text-zinc-300 whitespace-pre-line">
          {shippingAddress}
        </Text>
      </Section>

      <Text className="text-base leading-6 text-zinc-300">
        Vous recevrez un autre email dès que votre commande sera expédiée.
      </Text>
    </Layout>
  );
};

export default OrderConfirmation;
