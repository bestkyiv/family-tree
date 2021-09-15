import React, { FunctionComponent, useEffect, useState } from 'react';

import accessQuestions from 'config/accessQuestions';
import { adminTelegramUrl } from 'config/links';

import { getRandomItemsFromArray } from 'utils/arrayUtils';

import Loader from 'components/shared/loader/loader';

import './modal.scss';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (urlParams: string) => Promise<any>,
  onShowContent: () => void,
  error?: {
    type: string,
    details?: string,
  }
};

const questions = getRandomItemsFromArray(accessQuestions, 3);

const Modal: FunctionComponent<Props> = ({ onSubmit, onShowContent, error }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [urlParams, setUrlParams] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // чи був надісланий запит на бекенд
  const [isAccessGranted, setIsAccessGranted] = useState(false); // чи бекенд надав доступ
  const [isSubmitProcessing, setIsSubmitProcessing] = useState(false); // чи запит обробляється

  const inputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    // Залишати фокус на полі введення при зміні запитань
    if (!isSubmitProcessing && !isSubmitted && currentQuestion > 0) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }, [currentQuestion, isSubmitProcessing, isSubmitted, inputRef]);

  const submit = (params: string) => {
    setIsSubmitted(true);
    setIsSubmitProcessing(true);

    onSubmit(params)
      .then(() => setIsAccessGranted(true))
      .finally(() => setIsSubmitProcessing(false));
  };

  const showNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setCurrentAnswer('');
  };

  const handleButtonClick = () => {
    const newParam = `${questions[currentQuestion].id}=${encodeURIComponent(currentAnswer)}`;
    if (currentQuestion === questions.length - 1) {
      submit(`${urlParams}${currentQuestion ? '&' : ''}${newParam}`);
    }

    setUrlParams(`${urlParams}${currentQuestion ? '&' : ''}${newParam}`);
    showNextQuestion();
  };

  const getContentVariant = () => {
    if (isSubmitProcessing) {
      return <Loader small />;
    }

    if (error) {
      let errorMessage;
      switch (error.type) {
        case 'gapiKeyError':
          errorMessage = 'виникли проблеми з ключем Google API';
          break;
        case 'spreadsheetIDError':
          errorMessage = 'ID ейчарської таблиці недійсний (її видалили чи перемістили)';
          break;
        case 'sheetNameError':
          errorMessage = 'в ейчарській таблиці аркуш Members перейменували або видалили';
          break;
        case 'emptySheetError':
          errorMessage = 'в ейчарській таблиці видалили усю інформацію з аркуша Members';
          break;
        case 'columnsError':
          errorMessage = `в ейчарській таблиці видалили чи перейменували важливі колонки (${error.details})`;
          break;
        default:
          errorMessage = 'трапилась невідома помилка';
      }

      return (
        <>
          <div className="modal__title">Знову ейчари шось поламали...</div>
          <div className="modal__description">
            Здається у нас якісь трабли з деревом. Напиши&nbsp;
            <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a>
            &nbsp;, або комусь з HR відділу і скажи, що&nbsp;
            {errorMessage}
            .
          </div>
        </>
      );
    }

    if (!isSubmitted) {
      return (
        <>
          {questions.length > 0 && (
            <div className="modal__title">{questions[currentQuestion].value}</div>
          )}
          <div className="modal__answer-container">
            <input
              ref={inputRef}
              type="text"
              className="modal__answer-input"
              onChange={({ target }) => setCurrentAnswer(target.value)}
              onKeyPress={({ key }) => (key === 'Enter' && currentAnswer ? handleButtonClick() : null)}
              value={currentAnswer}
              autoFocus
            />
            <button
              type="button"
              className="modal__button"
              disabled={!currentAnswer}
              onClick={handleButtonClick}
            >
              {currentQuestion === questions.length - 1 ? 'Завершити' : 'Далі'}
            </button>
          </div>
          <div className="modal__description">
            Доступ до цієї сторінки мають лише бестіки ЛБГ Київ, а тебе я не знаю.
            Дай відповідь на декілька запитань, які знає кожен мембер нашої групи і тоді я впущу тебе.
          </div>
        </>
      );
    }

    if (isAccessGranted) {
      return (
        <>
          <div className="modal__title">Вітаю, бестік!</div>
          <div className="modal__description">
            Тут ти зможеш знайти інформацію про себе, усіх своїх предків, нащадків, братів та сестер.
            Якщо ти раптом знайшов неточності або відсутність якоїсь інформації, то напиши&nbsp;
            <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a>
            &nbsp;або будь-кому з HR відділу.
          </div>
          <button
            type="button"
            className="modal__continue-button"
            onClick={onShowContent}
            autoFocus
          >
            Подивитись дерево
          </button>
        </>
      );
    }

    return (
      <>
        <div className="modal__title">Упс!</div>
        <div className="modal__description">
          Здається ти не бестік, тому я не можу дати тобі сюди доступ.
          Якщо ти все таки бестік, але просто не впорався з запитаннями то напиши&nbsp;
          <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a>
          &nbsp;за допомогою.
        </div>
        <button
          type="button"
          className="modal__continue-button"
          onClick={() => {
            setIsSubmitted(false);
            setUrlParams('');
            setCurrentAnswer('');
            setCurrentQuestion(0);
          }}
          autoFocus
        >
          Спробувати ще раз
        </button>
      </>
    );
  };

  return (
    <div className="modal">
      {getContentVariant()}
    </div>
  );
};

export default Modal;
