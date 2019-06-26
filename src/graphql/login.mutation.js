import { gql } from 'apollo-boost';

const LOGIN_MUTATION = gql`
  mutation ($arg: LoginInput!) {
    login(arg: $arg) {
      success
      message
      name
    }
  }
`;

export default LOGIN_MUTATION;
