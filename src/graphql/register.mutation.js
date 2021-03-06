import { gql } from 'apollo-boost';

const REGISTER_MUTATION = gql`
  mutation ($arg: RegisterInput!) {
    register(arg: $arg) {
      success
      message
      userID
      name
      sessionID
    }
  }
`;

export default REGISTER_MUTATION;
