export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface DataValue {
  lastUpdated: string;
  storedBy: string;
  created: string;
  dataElement: string;
  value: string;
  providedElsewhere: boolean;
}

export interface Event {
  trackedEntityInstance: string;
  eventDate: number;
  dataValues: DataValue[];
  symbol: string;
}

export interface Entity {
  eventDate: string;
  orgUnit: string;
  activity: string;
  startDate: string;
  implementor: string;
  status: string;
}
