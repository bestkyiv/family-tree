export type AccessQuestionType = {id: `q${number}`, value: string};

const accessQuestions: Array<AccessQuestionType> = [
  { id: 'q1', value: 'На якому івенті обирають борд ЛБГ?' },
  { id: 'q2', value: 'Скільки членів у міжнародному борді?' },
  { id: 'q3', value: 'Перше що people always ask у бестіків?' },
  { id: 'q4', value: 'Як у бесті називається жест, що у нормальних людей означає OK?' },
  { id: 'q5', value: 'Яку назву має дружба ЛБГ Львів і ЛБГ Київ?' },
];

export default accessQuestions;
