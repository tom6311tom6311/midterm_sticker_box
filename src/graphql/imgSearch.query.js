import { gql } from 'apollo-boost';

const IMG_SEARCH_QUERY = gql`
  query ($searchTerm: String!) {
    imgSearch(searchTerm: $searchTerm) {
      stickerID
      ownerID
      tagIDs
      description
      type
    }
  }
`;

export default IMG_SEARCH_QUERY;
