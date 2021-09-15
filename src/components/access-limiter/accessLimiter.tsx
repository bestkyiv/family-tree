import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import cookie from 'react-cookies';

import { checkIfBestieEndpoint } from 'config/links';
import membersSheet from 'config/sheets';

import loadMembersData from 'utils/loadMembersData';

import { addNotification, setMembersListAction } from 'store/reducer';

import Loader from 'components/shared/loader/loader';

import Modal from './modal/modal';

import './accessLimiter.scss';

const COOKIES_DURATION_IN_DAYS = 180;

const AccessLimiter: FunctionComponent = ({ children }) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showChildren, setShowChildren] = useState(false);
  const [error, setError] = useState<{type: string, details?: string} | undefined>();

  const dispatch = useDispatch();

  const processWarnings = (warnings: Array<string>) => {
    if (!warnings.length) return;

    const missingColumns: Array<string> = [];
    warnings.forEach((warning) => {
      if (warning === 'activeColumnMissing') {
        missingColumns.push(membersSheet.columns.active);
      } else if (warning === 'pictureColumnMissing') {
        missingColumns.push(membersSheet.columns.picture);
      } else if (warning === 'birthdayColumnMissing') {
        missingColumns.push(membersSheet.columns.birthday);
      } else if (warning === 'recDateColumnMissing') {
        missingColumns.push(membersSheet.columns.recDate);
      } else if (warning === 'facultyColumnMissing') {
        missingColumns.push(membersSheet.columns.faculty);
      } else if (warning === 'familyColumnMissing') {
        missingColumns.push(membersSheet.columns.family);
      } else if (warning === 'telegramColumnMissing') {
        missingColumns.push(membersSheet.columns.telegram);
      } else if (warning === 'emailColumnMissing') {
        missingColumns.push(membersSheet.columns.email);
      } else if (warning === 'phoneColumnMissing') {
        missingColumns.push(membersSheet.columns.phone);
      } else if (warning === 'historyColumnMissing') {
        missingColumns.push(membersSheet.columns.history);
      } else if (warning === 'boardColumnMissing') {
        missingColumns.push(membersSheet.columns.board);
      } else if (warning === 'internationalDepsColumnMissing') {
        missingColumns.push(membersSheet.columns.internationalDeps);
      } else if (warning === 'internationalEventsColumnMissing') {
        missingColumns.push(membersSheet.columns.internationalEvents);
      }
    });

    dispatch(addNotification({
      id: 'loadDataWarning',
      body: (
        <>
          Неможливо завантажити усі дані. Передай ейчарам, що хтось видалив чи перейменував такі рядки:&nbsp;
          {missingColumns.join(', ')}
        </>
      ),
    }));
  };

  const loadData = (gapiKey: string, spreadsheetId: string) => new Promise((resolve, reject) => {
    loadMembersData(gapiKey, spreadsheetId)
      .then(({ membersList, warnings }) => {
        dispatch(setMembersListAction(membersList));
        processWarnings(warnings);
        resolve(true);
      })
      .catch((loadError) => {
        if (loadError.type === 'gapiKeyError' || loadError.type === 'spreadsheetIDError') {
          cookie.remove('gapiKey');
          cookie.remove('spreadsheetId');
        }

        reject(loadError);
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  });

  // перевірка чи є необхідні для доступу параметри в cookie
  useEffect(() => {
    const cookieGapiKey = cookie.load('gapiKey');
    const cookieSpreadsheetId = cookie.load('spreadsheetId');

    if (cookieGapiKey && cookieSpreadsheetId) {
      loadData(cookieGapiKey, cookieSpreadsheetId)
        .then(() => setShowChildren(true))
        .catch((e) => setError(e));
    } else {
      setIsDataLoading(false);
    }
  }, []);

  const onModalSubmit = (urlParams: string) => new Promise((resolve, reject) => {
    fetch(`${checkIfBestieEndpoint}?${urlParams}`)
      .then((response) => response.json())
      .then((responseJSON) => {
        if (Object.prototype.hasOwnProperty.call(responseJSON, 'error')) reject();

        const isGapiKeyInResponse = Object.prototype.hasOwnProperty.call(responseJSON, 'apiKey');
        const isSpreadsheetIdInResponse = Object.prototype.hasOwnProperty.call(responseJSON, 'spreadsheetId');

        if (isGapiKeyInResponse && isSpreadsheetIdInResponse) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + COOKIES_DURATION_IN_DAYS);

          cookie.save('spreadsheetId', responseJSON.spreadsheetId, { expires: expirationDate });
          cookie.save('gapiKey', responseJSON.apiKey, { expires: expirationDate });

          loadData(responseJSON.apiKey, responseJSON.spreadsheetId)
            .then(() => resolve(true))
            .catch((e) => setError(e));
        }
      });
  });

  if (isDataLoading) return <Loader />;

  if (showChildren) return <>{children}</>;

  return (
    <div className="access-limiter">
      <Modal
        onSubmit={onModalSubmit}
        onShowContent={() => setShowChildren(true)}
        error={error}
      />
    </div>
  );
};

export default AccessLimiter;
