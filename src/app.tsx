import React, { FunctionComponent } from 'react';

import AccessLimiter from 'components/access-limiter/accessLimiter';
import Search from 'components/search/search';
import Canvas from 'components/canvas/canvas';
import FamilyTree from 'components/family-tree/familyTree';
import NotificationsContainer from 'components/notifications-container/notificationsContainer';

import './app.scss';

const App: FunctionComponent = () => (
  <AccessLimiter>
    <Search />
    <NotificationsContainer />
    <Canvas>
      <FamilyTree />
    </Canvas>
  </AccessLimiter>
);

export default App;
