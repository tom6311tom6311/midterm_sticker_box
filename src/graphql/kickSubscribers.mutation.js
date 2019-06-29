import { gql } from 'apollo-boost';

const KICK_SUBSCRIBERS_MUTATION = gql`
  mutation ($arg: KickSubscribersInput!) {
    kickSubscribers(arg: $arg) {
      success
      message
    }
  }
`;

export default KICK_SUBSCRIBERS_MUTATION;
