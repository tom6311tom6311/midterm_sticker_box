class ApolloClientManager {
  constructor() {
    this.apolloClient = null;
  }

  updateClient(apolloClient) {
    this.apolloClient = apolloClient;
  }

  makeQuery(gql, variables, callback = () => {}, failCallback = () => {}) {
    this.apolloClient
      .query({
        query: gql,
        variables,
      })
      .then(callback)
      .catch(failCallback);
  }

  makeMutation(gql, variables, callback = () => {}, failCallback = () => {}) {
    this.apolloClient
      .mutate({
        mutation: gql,
        variables,
      })
      .then(callback)
      .catch(failCallback);
  }
}

export default new ApolloClientManager();
