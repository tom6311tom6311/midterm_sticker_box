import { gql } from 'apollo-boost';

const LOGIN_MUTATION = gql`
  mutation ($arg: LoginInput!) {
    login(arg: $arg) {
      success
      message
      userID
      name
      sessionID
    }
  }
`;

export default LOGIN_MUTATION;
