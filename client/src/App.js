import React from 'react';
//importing needed apollo client dependencies
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// creating link for Apollo client and setting it to graphQL endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// authLink will include token
const authLink = setContext((_, { headers }) => {
  //grabbing token from local storage
  const token = localStorage.getItem('id_token');
  return {
    // include the token in authorization header if it exists
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//creating Apollo client instance
const client = new ApolloClient({
  //combining auth and htttp links
  link: authLink.concat(httpLink),
  // make a memory cche for data
  cache: new InMemoryCache(),
});

//Wrapping the app with out apollo client 
function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
