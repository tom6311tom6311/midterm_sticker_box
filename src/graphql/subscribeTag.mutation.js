import { gql } from 'apollo-boost';

const SUBSCRIBE_TAG_MUTATION = gql`
  mutation ($arg: SubscribeTagInput!) {
    subscribeTag(arg: $arg) {
      success
      message
    }
  }
`;

export default SUBSCRIBE_TAG_MUTATION;
