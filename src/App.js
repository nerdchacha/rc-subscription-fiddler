import { Row, Col } from 'react-bootstrap'
import { Provider } from 'react-redux';

import Header from './components/Header'
import Options from './components/Options'
import Terminal from './components/Terminal'
import configureStore from './store'

import './App.scss';

const store = configureStore()

function App() {
  return (
    <Provider store={store}>
      <div className="rc-notification-app">
        <Header />
        <div className="container">
          <Row>
            <Col md={6}>
              <Options />
            </Col>
            <Col md={6}>
              <Terminal />
            </Col>
          </Row>
        </div>
      </div>
    </Provider>
  );
}

export default App;
