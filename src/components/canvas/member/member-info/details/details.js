import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import howLongSince from 'utils/howLongSince';
import formatDate from 'utils/formatDate';

import Contacts from './contacts/contacts';

import './details.scss';

const propTypes = {
  recDate: PropTypes.instanceOf(Date),
  birthday: PropTypes.instanceOf(Date),
  family: PropTypes.string,
  contacts: PropTypes.object,
  isCollapsed: PropTypes.bool,
};

const defaultProps = {
  isCollapsed: false,
}

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areDetailsShown: false,
      transitionStarted: false,
    }
    this.memberInfoRef = React.createRef();
  }

  render() {
    const {contacts, isCollapsed} = this.props;

    return (
      <div className={classnames('details', {'details_collapsed': isCollapsed})}>
        {this.getDetailsItems().map(item => (
          <div
            key={item.key}
            className="details__item"
          >
            <div className="details__item-caption">{item.capture}</div>
            <div className="details__item-value">
              {item.value}
              {item.addition && <span className="details__item-addition"> ({item.addition})</span>}
            </div>
          </div>
        ))}
        <Contacts {...contacts} isCollapsed={isCollapsed}/>
      </div>
    );
  }

  getDetailsItems = () => {
    const {
      recDate,
      birthday,
      family,
    } = this.props;

    const detailsItems = [];

    if (birthday) {
      detailsItems.push({
        key: 'birthday',
        capture: 'День народження',
        value: formatDate(birthday),
        addition: howLongSince(birthday).years,
      });
    }

    if (recDate) {
      detailsItems.push({
        key: 'recDate',
        capture: 'Рекрутмент',
        value: formatDate(recDate),
        addition: this.getTimeInBEST() + ' тому',
      });
    }

    if (family) {
      detailsItems.push({
        key: 'family',
        capture: 'Сім\'я',
        value: family,
      });
    }

    return detailsItems;
  }

  getTimeInBEST = () => {
    const {recDate} = this.props;

    const timeInBEST = howLongSince(recDate);

    let formattedTimeInBEST = '';
    if (timeInBEST.years) formattedTimeInBEST += timeInBEST.years;
    if (timeInBEST.months) {
      if (timeInBEST.years) formattedTimeInBEST += ' ';
      formattedTimeInBEST += timeInBEST.months;
    }
    if (!timeInBEST.years || !timeInBEST.months) {
      if (timeInBEST.years || timeInBEST.months) formattedTimeInBEST += ' ';
      formattedTimeInBEST += timeInBEST.days;
    }

    return formattedTimeInBEST;
  }
}

Details.propTypes = propTypes;
Details.defaultProps = defaultProps;

export default Details;
