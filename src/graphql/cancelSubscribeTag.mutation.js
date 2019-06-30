import { gql } from 'apollo-boost';

const CANCEL_SUBSCRIBE_TAG_MUTATION = gql`
  mutation ($arg: CancelSubscribeTagInput!) {
    cancelSubscribeTag(arg: $arg) {
      success
      message
    }
  }
`;

export default CANCEL_SUBSCRIBE_TAG_MUTATION;
