import { Provider } from 'react-redux';
import { RcThemeProvider } from '@ringcentral/juno'
import { ConnectedRouter } from 'connected-react-router'
import Fiddler from './Fiddler'

import configureStore, { history } from './store'

import './App.scss';

const store = configureStore()

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <RcThemeProvider>
          <Fiddler />
        </RcThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
