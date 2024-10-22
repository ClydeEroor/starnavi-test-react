export type HeroProp = {
  id: number;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: Array<number>;
  species: Array<number>;
  vehicles: Array<number>;
  starships: Array<number>;
  created: Date;
  edited: Date;
  url: string;
};

export type StarshipProp = {
  id: number;
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: Array<number>;
  films: Array<number>;
  created: Date;
  edited: Date;
  url: string;
};

export type HeroListProp = {
  count: number;
  next: string | null;
  previous: string | null;
  results: HeroProp[];
};

export type StarshipList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: StarshipProp[];
};
export type PaginationProp = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};
