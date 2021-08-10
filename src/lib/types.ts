export type Obj = Record<string, unknown>;

export type Gift = {
  id?: number;
  description?: string /* ex. color and size can go here */;
  name: string;
  occasionId: number;
  personId: number;
  price?: number;
  url?: string;
};

export type GiftMap = Record<number, Gift>;
//export type GiftMap = {[id: string]: Gift}; //TODO: Is this better?

export type Occasion = {
  id?: number;
  day?: number;
  month?: number;
  name: string;
};

export type OccasionMap = Record<number, Occasion>;

export type Person = {
  id?: number;
  name: string;
  month: number /* birth */;
  day: number /* birth */;
  year?: number /* birth */;
};

export type PersonMap = Record<number, Person>;