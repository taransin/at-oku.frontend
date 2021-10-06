import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppLocalizationProvider } from './locale/l10n';
import { SocketProvider } from './providers/SocketProvider';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { main, Themes } from './themes';

const theme: { [name: string]: DefaultTheme } = {
  main,
};

const selectedTheme = Themes.MAIN;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme[selectedTheme]}>
      <AppLocalizationProvider>
        <Provider store={store}>
          <SocketProvider>
            <App />
          </SocketProvider>
        </Provider>
      </AppLocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
