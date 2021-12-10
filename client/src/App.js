import { Provider } from 'react-redux';
import { RcThemeProvider } from '@ringcentral/juno'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'

import SubscriptionAppWrapper from './SubscriptionAppWrapper'
import configureStore, { history } from './store'
import { monkeyPathFetch } from './fetch'

import './App.scss';

const { store, persistor } = configureStore()
monkeyPathFetch({dispatch: store.dispatch})

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={history}>
          <RcThemeProvider>
              <SubscriptionAppWrapper />
          </RcThemeProvider>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
