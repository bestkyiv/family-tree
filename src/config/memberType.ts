import { Moment } from 'moment';

export type MemberIdType = `member${number}`;

export type ContactsType = {
  telegram?: string,
  email?: string,
  phone?: string,
};

export type MembershipValueType = Array<{
  value: string,
  addition?: string,
}>;

export type MembershipType = {
  board?: string,
  projects?: MembershipValueType,
  departments?: MembershipValueType,
  internationalDeps?: MembershipValueType,
  internationalEvents?: MembershipValueType,
};

export type MemberDetailsType = {
  birthday?: Moment,
  recDate?: Moment,
  faculty?: string,
  family?: string,
  contacts?: ContactsType,
  membership?: MembershipType,
  history?: Array<string>,
};

export type MemberInfoType = {
  id: MemberIdType,
  name: string,
  status: string,
  activity?: {
    locally?: boolean,
    internationally?: boolean,
  },
  picture?: string,
  details?: MemberDetailsType,
  parent?: string,
};
