import { gql } from 'apollo-boost';

const OWN_STICKERS_AND_SUBSCRIBED_TAGS_QUERY = gql`
  query ($userID: ID!) {
    ownStickers(ownerID: $userID) {
      stickerID
      tags {
        tagID
        ownerID
        key
      }
      description
      type
    }
    subscribedTags(userID: $userID) {
      tagID,
      ownerID,
      key
    }
  }
`;

export default OWN_STICKERS_AND_SUBSCRIBED_TAGS_QUERY;
