import { gql } from 'apollo-boost';

const IMG_SEARCH_QUERY = gql`
  query ($arg: ImgSearchInput!) {
    imgSearch(arg: $arg) {
      success
      message
      searchResult {
        tagID
        tagKey
        stickers {
          stickerID
          ownerID
          description
          type
        }
      }
    }
  }
`;

export default IMG_SEARCH_QUERY;
