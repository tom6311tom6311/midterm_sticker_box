import { gql } from 'apollo-boost';

const UPDATE_STICKERS_MUTATION = gql`
  mutation ($arg: UpdateStickerInput!) {
    updateSticker(arg: $arg) {
      success
      message
    }
  }
`;

export default UPDATE_STICKERS_MUTATION;
