import React, {useEffect, useState} from 'react';
import cookie from 'react-cookies';

import accessQuestions from 'config/accessQuestions';
import {checkIfBestieEndpoint, adminTelegramUrl} from 'config/links';

import {getRandomItemsFromArray} from 'utils/arrayUtils';

import Loader from 'components/loader/loader';

import './accessLimiter.scss';

const QUESTIONS_AMOUNT = 3;
const COOKIES_DURATION_IN_DAYS = 180;

const AccessLimiter = ({children, onAccessGranted}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [urlParams, setUrlParams] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // чи був надісланий запит на бекенд
  const [isAccessGranted, setIsAccessGranted] = useState(false); // чи бекенд надав доступ
  const [isLoading, setIsLoading] = useState(false); // чи запит обробляється
  const [showChildren, setShowChildren] = useState(false);

  const inputRef = React.createRef();

  const loadRandomQuestions = () => setQuestions(getRandomItemsFromArray(accessQuestions, QUESTIONS_AMOUNT));

  useEffect(() => {
    const gapiKey = cookie.load('gapiKey');
    const spreadsheetId = cookie.load('spreadsheetId');

    if (spreadsheetId && gapiKey) {
      setShowChildren(true);

      onAccessGranted(gapiKey, spreadsheetId)
        .catch(errorMessage => {
          setShowChildren(false);
          loadRandomQuestions();

          cookie.remove('gapiKey');
          cookie.remove('spreadsheetId');

          throw new Error(errorMessage);
        });
    } else {
      loadRandomQuestions();
    }
  }, [onAccessGranted]);

  useEffect(() => {
    // Залишати фокус на полі введення при зміні запитань
    if (!isLoading && !isSubmitted && currentQuestion > 0)
      inputRef.current.focus();
  }, [currentQuestion, isLoading, isSubmitted, inputRef]);

  const submit = async () => {
    setIsSubmitted(true);
    setIsLoading(true);

    const response = await fetch(`${checkIfBestieEndpoint}?${urlParams}`);
    const responseJson = await response.json();

    setIsLoading(false);

    if (responseJson.hasOwnProperty('apiKey') && responseJson.hasOwnProperty('spreadsheetId')) {
      onAccessGranted(responseJson.apiKey, responseJson.spreadsheetId);
      setIsAccessGranted(true);

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + COOKIES_DURATION_IN_DAYS);

      cookie.save('spreadsheetId', responseJson.spreadsheetId, {expires: expirationDate});
      cookie.save('gapiKey', responseJson.apiKey, {expires: expirationDate});
    }
  };

  const showNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setCurrentAnswer('');
  };

  const handleButtonClick = () => {
    setUrlParams(`${urlParams}${currentQuestion ? '&' : ''}${questions[currentQuestion].id}=${encodeURIComponent(currentAnswer)}`);
    currentQuestion === questions.length - 1 ? submit() : showNextQuestion()
  };

  const getContentVariant = () => {
    if (isLoading) {
      return <Loader size="s"/>;
    }

    if (!isSubmitted) {
      return (
        <>
          {questions.length > 0 && (
            <div className="access-limiter__title">{questions[currentQuestion].value}</div>
          )}
          <div className="access-limiter__answer-container">
            <input
              ref={inputRef}
              type="text"
              className="access-limiter__answer-input"
              onChange={({target}) => setCurrentAnswer(target.value)}
              onKeyPress={e => e.key === 'Enter' && currentAnswer ? handleButtonClick() : null}
              value={currentAnswer}
              autoFocus
            />
            <button
              type="button"
              className="access-limiter__button"
              disabled={!currentAnswer}
              onClick={handleButtonClick}
            >
              {currentQuestion === questions.length - 1 ? 'Завершити' : 'Далі'}
            </button>
          </div>
          <div className="access-limiter__description">
            Доступ до цієї сторінки мають лише бестіки ЛБГ Київ, а тебе я не знаю.
            Дай відповідь на декілька запитань, які знає кожен мембер нашої групи і тоді я впущу тебе.
          </div>
        </>
      );
    }

    if (isAccessGranted) {
      return (
        <>
          <div className="access-limiter__title">Вітаю, бестік!</div>
          <div className="access-limiter__description">
            Тут ти зможеш знайти інформацію про себе, усіх своїх предків, нащадків, братів та сестер.
            Якщо ти раптом знайшов неточності або відсутність якоїсь інформації, то напиши
            <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a>
            або будь-кому з HR відділу.
          </div>
          <button
            type="button"
            className="access-limiter__continue-button"
            onClick={() => setShowChildren(true)}
            autoFocus
          >
            Подивитись дерево
          </button>
        </>
      );
    }

    return (
      <>
        <div className="access-limiter__title">Упс!</div>
        <div className="access-limiter__description">
          Здається ти не бестік, тому я не можу дати тобі сюди доступ.
          Якщо ти все таки бестік, але просто не впорався з запитаннями то напиши
          <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a>
          за допомогою.
        </div>
        <button
          type="button"
          className="access-limiter__continue-button"
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

  if (showChildren) return children;

  if (questions.length === 0) return null;

  return (
    <div className="access-limiter">
      <div className="access-limiter__container">
        {getContentVariant()}
      </div>
    </div>
  );
};

export default AccessLimiter;
