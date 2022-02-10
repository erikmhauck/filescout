import React from 'react';
import logger from '../logger';

const log = logger('app');

function App() {
  log.info('Rendering main app');
  return <p>Hello from Client</p>;
}

export default App;
