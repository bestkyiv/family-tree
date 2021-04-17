import React, {Component} from 'react';
import cookie from 'react-cookies'
import PropTypes from 'prop-types';

import accessQuestions from 'config/accessQuestions';
import {checkIfBestieEndpoint, adminTelegramUrl} from 'config/links';

import getRandomItemsFromArray from 'utils/getRandomItemsFromArray';

import Loader from 'components/loader/loader';

import './accessLimiter.scss';

const QUESTIONS_AMOUNT = 3;
const COOKIES_DURATION_IN_DAYS = 180;

const propTypes = {
  onAccessGranted: PropTypes.func.isRequired,
};

class AccessLimiter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      currentQuestion: 0,
      currentAnswer: '',
      urlParams: '',
      isSubmitted: false, // чи був надісланий запит на бекенд
      isAccessGranted: false, // чи бекенд надав доступ
      isLoading: false, // чи запит обробляється
      showChildren: false,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const {onAccessGranted} = this.props;

    const gapiKey = cookie.load('gapiKey');
    const spreadsheetId = cookie.load('spreadsheetId');

    if (spreadsheetId && gapiKey) {
      this.setState({showChildren: true});

      onAccessGranted(gapiKey, spreadsheetId)
        .catch(errorMessage => {
          this.setState({showChildren: false});
          this.loadRandomQuestions();

          cookie.remove('gapiKey');
          cookie.remove('spreadsheetId');

          throw new Error(errorMessage);
        });
    } else {
      this.loadRandomQuestions();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {isLoading, isSubmitted} = this.props;
    const {currentQuestion} = this.state;

    // Залишати фокус на полі введення при зміні запитань
    if (!isLoading && !isSubmitted && prevState.currentQuestion !== currentQuestion) {
      this.inputRef.current.focus();
    }
  }

  render() {
    const {children} = this.props;
    const {showChildren} = this.state;

    return showChildren ? children : (
      <div className="access-limiter">
        <div className="access-limiter__container">
          {this.getContentVariant()}
        </div>
      </div>
    );
  }

  getContentVariant() {
    const {
      questions,
      currentQuestion,
      currentAnswer,
      isSubmitted,
      isAccessGranted,
      isLoading,
    } = this.state;

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
              ref={this.inputRef}
              type="text"
              className="access-limiter__answer-input"
              onChange={this.handleInputChange}
              onKeyPress={e => e.key === 'Enter' && currentAnswer ? this.handleButtonClick() : null}
              value={currentAnswer}
              autoFocus
            />
            <button
              type="button"
              className="access-limiter__button"
              disabled={!currentAnswer}
              onClick={this.handleButtonClick}
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
            Якщо ти раптом знайшов неточності або відсутність якоїсь інформації, то напиши <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a> або будь-кому з HR відділу.
          </div>
          <button
            type="button"
            className="access-limiter__continue-button"
            onClick={() => this.setState({showChildren: true})}
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
          Якщо ти все таки бестік, але просто не впорався з запитаннями то напиши <a href={adminTelegramUrl} target="_blank" rel="noreferrer">@dimamyhal</a> за допомогою.
        </div>
        <button
          type="button"
          className="access-limiter__continue-button"
          onClick={() => this.setState({
            isSubmitted: false,
            urlParams: '',
            currentAnswer: '',
            currentQuestion: 0,
          })}
          autoFocus
        >
          Спробувати ще раз
        </button>
      </>
    );
  }

  loadRandomQuestions = () => this.setState({questions: getRandomItemsFromArray(accessQuestions, QUESTIONS_AMOUNT)});

  handleInputChange = ({target}) => {
    this.setState({currentAnswer: target.value});
  }

  handleButtonClick = () => {
    const {
      questions,
      currentQuestion,
      currentAnswer,
    } = this.state;

    this.setState(
      prevState => ({
        urlParams: `${prevState.urlParams}${currentQuestion ? '&' : ''}${questions[currentQuestion].id}=${encodeURIComponent(currentAnswer)}`
      }),
      currentQuestion === questions.length - 1
        ? this.submit
        : this.showNextQuestion
    );
  }

  showNextQuestion = () => {
    this.setState(prevState => {
      return {
        currentQuestion: prevState.currentQuestion + 1,
        currentAnswer: '',
      }
    });
  }

  submit = async () => {
    const {onAccessGranted} = this.props;
    const {urlParams} = this.state

    this.setState({
      isSubmitted: true,
      isLoading: true,
    });

    const response = await fetch(`${checkIfBestieEndpoint}?${urlParams}`);
    const responseJson = await response.json();

    this.setState({isLoading: false});

    if (responseJson.hasOwnProperty('apiKey') && responseJson.hasOwnProperty('spreadsheetId')) {
      onAccessGranted(responseJson.apiKey, responseJson.spreadsheetId);
      this.setState({isAccessGranted: true});

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + COOKIES_DURATION_IN_DAYS);

      cookie.save('spreadsheetId', responseJson.spreadsheetId, {expires: expirationDate});
      cookie.save('gapiKey', responseJson.apiKey, {expires: expirationDate});
    }
  }
}

AccessLimiter.propTypes = propTypes;

export default AccessLimiter;
