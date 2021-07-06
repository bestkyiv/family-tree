import React, {ReactElement, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import cookie from 'react-cookies';

import accessQuestions from 'config/accessQuestions';
import {checkIfBestieEndpoint, adminTelegramUrl} from 'config/links';

import loadMembersData from 'utils/loadMembersData';
import {getRandomItemsFromArray} from 'utils/arrayUtils';

import {setMembersListAction} from 'store/reducer';

import Loader from 'components/loader/loader';

import {AccessQuestionType} from 'config/accessQuestions';

import './accessLimiter.scss';

const QUESTIONS_AMOUNT = 3;
const COOKIES_DURATION_IN_DAYS = 180;

type Props = {
  children: ReactElement[],
};

const AccessLimiter = ({children}: Props) => {
  const [questions, setQuestions] = useState<Array<AccessQuestionType>>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [urlParams, setUrlParams] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // чи був надісланий запит на бекенд
  const [isAccessGranted, setIsAccessGranted] = useState(false); // чи бекенд надав доступ
  const [isLoading, setIsLoading] = useState(false); // чи запит обробляється
  const [showChildren, setShowChildren] = useState(false);
  const [errorType, setErrorType] = useState('');
  
  const dispatch = useDispatch();

  const inputRef = React.createRef<HTMLInputElement>();

  const loadRandomQuestions = () => setQuestions(getRandomItemsFromArray(accessQuestions, QUESTIONS_AMOUNT));

  useEffect(() => {
    const gapiKey = cookie.load('gapiKey');
    const spreadsheetId = cookie.load('spreadsheetId');

    if (spreadsheetId && gapiKey) {
      setShowChildren(true);
  
      loadMembersData(gapiKey, spreadsheetId)
        .then(membersList => dispatch(setMembersListAction(membersList)))
        .catch(errorType => {
          setShowChildren(false);
          setErrorType(errorType);
          
          if (errorType === 'gapiKeyError' || errorType === 'spreadsheetIDError') {
            cookie.remove('gapiKey');
            cookie.remove('spreadsheetId');
          }
        });
    } else {
      loadRandomQuestions();
    }
  }, [dispatch]);

  useEffect(() => {
    // Залишати фокус на полі введення при зміні запитань
    if (!isLoading && !isSubmitted && currentQuestion > 0)
      (inputRef.current as HTMLInputElement).focus();
  }, [currentQuestion, isLoading, isSubmitted, inputRef]);

  const submit = async () => {
    setIsSubmitted(true);
    setIsLoading(true);

    const response = await fetch(`${checkIfBestieEndpoint}?${urlParams}`);
    const responseJson = await response.json();

    if (responseJson.hasOwnProperty('apiKey') && responseJson.hasOwnProperty('spreadsheetId')) {
      setIsAccessGranted(true);
  
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + COOKIES_DURATION_IN_DAYS);
  
      cookie.save('spreadsheetId', responseJson.spreadsheetId, {expires: expirationDate});
      cookie.save('gapiKey', responseJson.apiKey, {expires: expirationDate});
      
      try {
        const membersList = await loadMembersData(responseJson.apiKey, responseJson.spreadsheetId);
        dispatch(setMembersListAction(membersList));
      }
      catch (errorType) {
        setErrorType(errorType);
      }
    }
    
    setIsLoading(false);
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
  
    if (errorType) {
      let errorMessage = 'трапилась невідома помилка';
      switch (errorType) {
        case 'gapiKeyError': errorMessage = 'виникли проблеми з ключем Google API'; break;
        case 'spreadsheetIDError': errorMessage = 'ID ейчарської таблиці недійсний (її видалили чи перемістили)'; break;
        case 'sheetNameError': errorMessage = 'в ейчарській таблиці аркуш Members перейменували або видалили'; break;
        case 'emptySheetError': errorMessage = 'в ейчарській таблиці видалили усю інформацію з аркуша Members'; break;
        case 'nameColumnError': errorMessage = 'в ейчарській таблиці видалили чи перейменували колонку ПІБ'; break;
        case 'statusColumnError': errorMessage = 'в ейчарській таблиці видалили чи перейменували колонку Статус'; break;
        case 'nameAndStatusColumnsError': errorMessage = 'в ейчарській таблиці видалили чи перейменували колонки ПІБ і Статус'; break;
      }
    
      return (
        <>
          <div className="access-limiter__title">Знову ейчари шось поламали...</div>
          <div className="access-limiter__description">
            Здається у нас якісь трабли з деревом. Напиши&nbsp;
            <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a>
            &nbsp;, або комусь з HR відділу і скажи, що {errorMessage}.
          </div>
        </>
      );
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
            Якщо ти раптом знайшов неточності або відсутність якоїсь інформації, то напиши&nbsp;
            <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a>
            &nbsp;або будь-кому з HR відділу.
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
          Якщо ти все таки бестік, але просто не впорався з запитаннями то напиши&nbsp;
          <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a>
          &nbsp;за допомогою.
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

  return showChildren
    ? <>{children}</>
    : (questions.length !== 0 || errorType) ? (
        <div className="access-limiter">
          <div className="access-limiter__container">
            {getContentVariant()}
          </div>
        </div>
      ) : null;
};

export default AccessLimiter;
