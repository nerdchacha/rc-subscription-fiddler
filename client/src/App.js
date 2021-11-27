import { Provider } from 'react-redux';
import { Container } from '@mui/material'
import { RcThemeProvider } from '@ringcentral/juno'
import { ConnectedRouter } from 'connected-react-router'
import { Route } from 'react-router-dom'
 
import Header from './components/Header'

import Configuration from './components/Configuration'
import Login from './pages/Login'
import Fiddler from './pages/Fiddler'

import configureStore, { history } from './store'

import './App.scss';

const store = configureStore()

function App(props) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <RcThemeProvider>
          <div className="rc-notification-app">
            <Header />
            <Container maxWidth="xl" space={2} className="container">
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Fiddler} />
              <Configuration />
            </Container>
          </div>
        </RcThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
