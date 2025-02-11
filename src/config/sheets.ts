type Sheet = {
  name: string,
  columns: {
    [key: string]: string,
  },
};

const membersSheet: Sheet = {
  name: 'Members',
  columns: {
    name: 'ПІБ',
    status: 'Статус',
    parent: 'Ментор',
    active: 'Активний',
    picture: 'Фотографія',
    birthday: 'День народження',
    recDate: 'Рекрутмент',
    faculty: 'Факультет',
    family: 'Сім\'я',
    telegram: 'Telegram',
    email: 'Email',
    phone: 'Телефон',
    history: 'Історія',
    board: 'Board',
    projects: 'Проєкти',
    departments: 'Департаменти',
    internationalDeps: 'Міжнар депи і проєкти',
    internationalEvents: 'Міжнар івенти',
  },
};

export default membersSheet;
