import { gql } from 'apollo-boost';

const OWN_STICKERS_QUERY = gql`
  query ($ownerID: ID!) {
    ownStickers(ownerID: $ownerID) {
      stickerID
      tags {
        tagID
        ownerID
        key
      }
      description
      type
    }
  }
`;

export default OWN_STICKERS_QUERY;
