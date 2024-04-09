function useApolloClient() {
    return new ApolloClient({
      uri: 'http://localhost:5005/graphql',
      cache: new InMemoryCache(),
    });
  }