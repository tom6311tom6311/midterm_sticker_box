import { gql } from 'apollo-boost';

const REGISTER_MUTATION = gql`
  mutation ($userID: String!, $name: String!, $password: String!) {
    register(arg: {
      userID: $userID,
      password: $password,
      name: $name,
    }) {
      success
      message
    }
  }
`;

export default REGISTER_MUTATION;
