import { gql } from 'apollo-boost';

const CREATE_TAG_MUTATION = gql`
  mutation ($arg: CreateTagInput!) {
    createTag(arg: $arg) {
      success
      message
    }
  }
`;

export default CREATE_TAG_MUTATION;
