import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import * as serviceWorker from './util/serviceWorker.func';
import AppConfig from './const/AppConfig.const';
import Main from './containers/Main.container';

// Create an http link:
const httpLink = new HttpLink({
  uri: AppConfig.SERVER_URL.HTTP,
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: AppConfig.SERVER_URL.WS,
  options: { reconnect: true },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore({}),
});

const wrappedApp = (
  <AppContainer>
    <ApolloProvider client={client}>
      <Main apolloClient={client} />
    </ApolloProvider>
  </AppContainer>
);

const render = () => {
  // eslint-disable-next-line no-undef
  ReactDOM.render(wrappedApp, document.getElementById('App'));
};

console.log(document.getElementById('App'));

render();

if (module.hot) {
  module.hot.accept(render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
