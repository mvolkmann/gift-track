export type Obj = Record<string, unknown>;

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

export type GiftMap = Record<number, Gift>;
//export type GiftMap = {[id: string]: Gift}; //TODO: Is this better?

export type GiftResponse = {body?: Gift; status?: number};
export type OccasionResponse = {body?: Occasion; status?: number};
export type PersonResponse = {body?: Person; status?: number};

export type Occasion = {
  id?: number;
  day?: number;
  month?: number;
  name: string;
};

export type OccasionMap = Record<number, Occasion>;

export type Person = {
  id?: number;
  editing?: boolean;
  name: string;
  month: number /* birth */;
  day: number /* birth */;
  year?: number /* birth */;
};

export type PersonMap = Record<number, Person>;
