import { gql } from 'apollo-boost';

const DELETE_STICKER_MUTATION = gql`
  mutation ($arg: DeleteStickerInput!) {
    deleteSticker(arg: $arg) {
      success
      message
    }
  }
`;

export default DELETE_STICKER_MUTATION;
