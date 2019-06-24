import { gql } from 'apollo-boost';

const LOGIN_MUTATION = gql`
  mutation ($arg: LoginInput!) {
    login(arg: $arg) {
      success
      message
    }
  }
`;

export default LOGIN_MUTATION;
