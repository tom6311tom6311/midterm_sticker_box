import { gql } from 'apollo-boost';

const OWN_STICKERS_QUERY = gql`
  query ($ownerID: ID!) {
    ownStickers(ownerID: $ownerID) {
      stickerID
      ownerID
      tagIDs
      description
      type
    }
  }
`;

export default OWN_STICKERS_QUERY;
