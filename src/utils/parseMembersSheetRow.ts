import moment from 'moment';
import 'moment/locale/uk';

import {
  MemberInfoType,
  MemberDetailsType,
  MembershipType,
  MembershipValueType,
} from 'config/memberType';

const DATE_FORMAT = 'DD.MM.YYYY';

const telegramRegExp = new RegExp('^@\\w{5,}$');
const emailRegExp = new RegExp('^[\\w.%+-]+@\\w+\\.\\w{2,}$');
const phoneRegExp = new RegExp('^380\\d{9}$');

const formatPictureSrc = (link: string) => `https://drive.google.com/uc?id=${/[-\w]{25,}/.exec(link)}&export=download`;

const validate = (string: string, regex: RegExp) => (regex.test(string) ? string : undefined);

const parseMultilineMembershipValue = (cellValue: string): MembershipValueType => cellValue
  .split('\n').filter((item) => !!item)
  .map((line) => {
    const isAdditionExist = /\(.+\)/g.test(line);
    const value = isAdditionExist ? line.split(' (')[0] : line;
    const addition = isAdditionExist ? line.split(' (')[1].slice(0, -1) : undefined;
    return { value, addition };
  });

const parseMembersSheetRow = (
  row: Array<string>,
  rowId: number,
  columnIds: {
    name: number,
    status: number,
    [key: string]: number,
  },
  existingProjects: Array<string>,
  existingDeps: Array<string>,
): MemberInfoType => {
  const memberData: MemberInfoType = {
    id: `member${(rowId + 1)}`,
    name: row[columnIds.name],
    status: row[columnIds.status],
  };

  const isActiveLocally = row[columnIds.active] === 'TRUE';
  const isActiveInternationally = !!row[columnIds.internationalDeps] || !!row[columnIds.internationalEvents];
  if (isActiveLocally || isActiveInternationally) {
    memberData.activity = {};
    if (isActiveLocally) memberData.activity.locally = isActiveLocally;
    if (isActiveInternationally) memberData.activity.internationally = isActiveInternationally;
  }

  const picture = row[columnIds.picture];
  if (picture) memberData.picture = formatPictureSrc(picture);

  const parent = row[columnIds.parent];
  if (parent) memberData.parent = parent;

  const details: MemberDetailsType = {};

  const birthday = moment(row[columnIds.birthday], DATE_FORMAT);
  if (birthday.isValid()) details.birthday = birthday;

  const recDate = moment(row[columnIds.recDate], DATE_FORMAT);
  if (recDate.isValid()) details.recDate = recDate;

  const faculty = row[columnIds.faculty];
  if (faculty) details.faculty = faculty;

  const family = row[columnIds.family];
  if (family) details.faculty = family;

  const telegram = validate(row[columnIds.telegram], telegramRegExp);
  const email = validate(row[columnIds.email], emailRegExp);
  const phone = validate(row[columnIds.phone], phoneRegExp);
  if (telegram || email || phone) details.contacts = { telegram, email, phone };

  const history = row[columnIds.history].split('\n').filter((item) => !!item);
  if (history.length > 0) details.history = history;

  const membership: MembershipType = {};

  const boardValue = row[columnIds.board];
  if (boardValue && !boardValue.includes('Подача')) membership.board = boardValue;

  const projects: MembershipValueType = existingProjects
    .filter((project, projectId) => {
      const position = row[columnIds.projectsFirst + projectId];
      return position && !position.includes('Подача');
    })
    .map((project, projectId) => ({
      value: project,
      addition: row[columnIds.projectsFirst + projectId],
    }));
  if (projects.length > 0) membership.projects = projects;

  const departments: MembershipValueType = existingDeps
    .filter((dep, depId) => row[columnIds.depsFirst + depId])
    .map((dep, depId) => {
      const result: {value: string, addition?: string} = { value: dep };
      const position = row[columnIds.depsFirst + depId];
      if (position && position !== 'Member') result.addition = position;
      return result;
    });
  if (departments.length > 0) membership.departments = departments;

  const internationalDeps = parseMultilineMembershipValue(row[columnIds.internationalDeps]);
  if (internationalDeps.length > 0) membership.internationalDeps = internationalDeps;

  const internationalEvents = parseMultilineMembershipValue(row[columnIds.internationalEvents]);
  if (internationalEvents.length > 0) membership.internationalEvents = internationalEvents;

  if (Object.keys(membership).length > 0) details.membership = membership;

  if (Object.keys(details).length > 0) memberData.details = details;

  return memberData;
};

export default parseMembersSheetRow;
