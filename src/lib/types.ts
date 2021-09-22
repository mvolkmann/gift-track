export type Gift = {
  id?: number;
  description?: string /* ex. color and size can go here */;
  location?: string /* Where in the house did you put it? */;
  name: string;
  occasionId: number;
  personId: number;
  price?: number;
  url?: string;
};

export type GiftMap = {[id: string]: Gift};

export type GiftResponse = {body?: Gift; status?: number};
export type OccasionResponse = {body?: Occasion; status?: number};
export type PersonResponse = {body?: Person; status?: number};

export type Item = {
  id?: number;
  editing?: boolean;
  name: string;
  month?: number;
  day?: number;
  year?: number;
};

export enum ItemKind {
  OCCASION = 'occasion',
  PERSON = 'person'
}

export type Obj = {[key: string]: unknown};

export type Occasion = Item;
export type OccasionMap = Record<number, Occasion>;

export type Person = Item;
export type PersonMap = Record<number, Person>;
