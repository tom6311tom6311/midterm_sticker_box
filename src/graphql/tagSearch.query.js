import { gql } from 'apollo-boost';

const TAG_SEARCH = gql`
  query ($searchKey: String!) {
    tagSearch(searchKey: $searchKey) {
      tagID,
      key,
      owner {
        userID,
        name
      }
    }
  }
`;

export default TAG_SEARCH;
