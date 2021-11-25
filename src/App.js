import { Provider } from 'react-redux';
import { Grid, Container } from '@mui/material'
import { RcThemeProvider } from '@ringcentral/juno'

import Header from './components/Header'
import Options from './components/Options'
import Terminal from './components/Terminal'
import Configuration from './components/Configuration'

import configureStore from './store'

import './App.scss';

const store = configureStore()

function App(props) {
  return (
    <Provider store={store}>
      <RcThemeProvider>
        <div className="rc-notification-app">
          <Header />
          <Container maxWidth="xl" space={2} className="container">
            <Grid item md={6}>
              <Options />
            </Grid>
            <Grid item md={6}>
              <Terminal />
            </Grid>
            <Configuration />
          </Container>
        </div>
      </RcThemeProvider>
    </Provider>
  );
}

export default App;
