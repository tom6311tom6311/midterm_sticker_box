import { gql } from 'apollo-boost';

const DELETE_TAG_MUTATION = gql`
  mutation ($arg: DeleteTagInput!) {
    deleteTag(arg: $arg) {
      success
      message
    }
  }
`;

export default DELETE_TAG_MUTATION;
