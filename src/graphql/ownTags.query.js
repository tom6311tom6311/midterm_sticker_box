import { gql } from 'apollo-boost';

const OWN_TAGS_QUERY = gql`
  query ($ownerID: ID!) {
    ownTags(ownerID: $ownerID) {
      tagID,
      ownerID,
      stickerIDs,
      subscriberIDs,
      key
    }
  }
`;

export default OWN_TAGS_QUERY;
