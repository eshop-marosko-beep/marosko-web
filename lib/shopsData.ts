export type Shop = {
  slug: string;
  translationKey: string;
  url: string;
  primary?: boolean;
};

export const shops: Shop[] = [
  {
    slug: "eshop-marosko",
    translationKey: "marosko",
    url: "https://eshop.marosko.sk",
    primary: true,
  },
  {
    slug: "vercajch",
    translationKey: "vercajch",
    url: "https://vercajch.eu",
  },
  {
    slug: "rezbarske-naradie",
    translationKey: "rezbarskeNaradie",
    url: "https://rezbarskenaradie.sk",
  },
];
