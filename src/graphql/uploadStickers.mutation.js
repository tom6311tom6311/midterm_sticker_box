import { gql } from 'apollo-boost';

const UPLOAD_STICKERS_MUTATION = gql`
  mutation ($arg: UploadStickerInput!) {
    uploadSticker(arg: $arg) {
      success
      message
    }
  }
`;

export default UPLOAD_STICKERS_MUTATION;
