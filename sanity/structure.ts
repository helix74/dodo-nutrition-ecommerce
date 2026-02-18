import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Dodo Nutrition")
    .items([
      // --- Marketing ---
      S.listItem()
        .title("Marketing")
        .child(
          S.list()
            .title("Marketing")
            .items([
              S.documentTypeListItem("heroSlide").title("Hero Slides"),
              S.documentTypeListItem("banner").title("Bannières"),
            ])
        ),

      S.divider(),

      // --- Catalogue ---
      S.listItem()
        .title("Catalogue")
        .child(
          S.list()
            .title("Catalogue")
            .items([
              S.documentTypeListItem("product").title("Produits"),
              S.documentTypeListItem("pack").title("Packs"),
              S.documentTypeListItem("category").title("Catégories"),
              S.documentTypeListItem("brand").title("Marques"),
            ])
        ),

      S.divider(),

      // --- Commerce ---
      S.listItem()
        .title("Commerce")
        .child(
          S.list()
            .title("Commerce")
            .items([
              S.documentTypeListItem("order").title("Commandes"),
              S.documentTypeListItem("customer").title("Clients"),
              S.documentTypeListItem("review").title("Avis"),
            ])
        ),

      S.divider(),

      // --- Approvisionnement ---
      S.listItem()
        .title("Approvisionnement")
        .child(
          S.list()
            .title("Approvisionnement")
            .items([
              S.documentTypeListItem("supplier").title("Fournisseurs"),
              S.documentTypeListItem("invoice").title("Factures"),
            ])
        ),
    ]);
