import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface LayoutProps {
  preview?: string;
  children: React.ReactNode;
}

export const Layout = ({ preview, children }: LayoutProps) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                background: "#09090b", // zinc-950
                foreground: "#fafafa", // zinc-50
                primary: "#fee257", // dodo-yellow
                secondary: "#f01b24", // dodo-red
                muted: "#a1a1aa", // zinc-400
                card: "#18181b", // zinc-900
              },
            },
          },
        }}
      >
        <Head />
        {preview && <Preview>{preview}</Preview>}
        <Body className="bg-background font-sans text-foreground">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg border border-zinc-800 bg-card p-8 shadow-xl">
            {/* Logo */}
            <Section className="mb-8 text-center">
              <Img
                src="https://cdn.sanity.io/images/q8511b3m/production/2f713a7a5215e0181508c5f499695487d6f56281-235x64.png"
                alt="Dodo Nutrition"
                width="180"
                className="mx-auto"
              />
            </Section>

            {/* Content */}
            {children}

            {/* Footer */}
            <Section className="mt-8 border-t border-zinc-800 pt-8 text-center text-xs text-muted">
              <Text className="mb-4">
                Dodo Nutrition - Votre partenaire nutrition et bien-être.
              </Text>
              <div className="flex justify-center gap-4">
                <Link href="https://dodonutrition.tn" className="text-primary underline">
                  Site Web
                </Link>
                <Link href="https://instagram.com/dodonutrition" className="text-primary underline">
                  Instagram
                </Link>
              </div>
              <Text className="mt-4 text-zinc-600">
                © {new Date().getFullYear()} Dodo Nutrition. Tous droits réservés.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Layout;
