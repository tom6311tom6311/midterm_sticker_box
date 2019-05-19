# StickerBox
A cross-platform desktop app featuring search, pick, save, and share stickers while chatting with others.

## Overview
StickerBox is an all-in-one solution for users to deal with sticker images while chatting with others on desktop apps such as Line, Slack, Messenger, ...etc. The application supports MacOS, Windows, and Linux. With StickerBox, users can browse and search for stickers. To send a sticker, just drag it from StickerBox to desktop chatting apps. Besides browsing and searching, StickerBox also provides drag-and-upload feature, which allows users to upload local images to server and share with others. In summary, StickerBox covers all needs regarding to stickers in a desktop-chat settings.

* Note: due to the backend monolingual word-emdedding settings, StickerBox only supports **Chinese** so far.
* Disclaimer: this app provides features of uploading images in public domain. However, before you download and use it, please be noticed that we are not leagally responsible for any kind of misusage regarding to copyrights. Please do not upload any images without permission of their own creator! (The default images of this project were from [Pixabay](https://pixabay.com/) -- A vibrant community of creatives, sharing copyright free images and videos)

## How to use

* Download the latest distributable of your platform.
  - [Mac](https://github.com/tom6311tom6311/midterm_sticker_box/releases/download/v1.0/midterm_sticker_box.app.zip)
  - [Win]()

* When downloaded, unzip the file and you can run the resulting executable

* To search and browse:

![Alt Text](src/demo/browse.gif)

* To send:

![Alt Text](src/demo/send.gif)

* To upload:

![Alt Text](src/demo/upload.gif)

## Known issues
1. This app doesn't support drag stickers to Slack and Messenger directly so far, since they only accept local files to be dropped in. As a workaround, please drag the sticker to desktop, then drag it from desktop to Slack / Messenger.

## Tech/Framework used
* [React](https://reactjs.org/) - The web framework used
* [Node](https://nodejs.org/) - The backend runtime environment
* [Electron](https://electronjs.org/) - The framework used to build cross-platfrom Apps

## How to build
1. Please find a server machine and follow [this](https://github.com/tom6311tom6311/sticker_box_server) README to deploy the server
2. Exit the server and turn back to your local computer
2. Make sure you have Node (`^10.15.3`) and NPM (`^6.9.0`) installed
3. Clone [this](https://github.com/tom6311tom6311/midterm_sticker_box.git) project to your computer
4. `cd midterm_sticker_box`
5. `npm i`
10. In `src/const/AppConfig.const.js`, set `SERVER_URL` to `http://<your server's IP or domain>:5000`.

## Credits
* [Electron Forge](https://electronforge.io) for the Electron + React boilerplate
* [Kyubyong](https://github.com/Kyubyong/wordvectors) for the pre-trained word vectors
* [Pixaby](https://pixabay.com) for the high-quality copyright-free images
* [jieba](https://www.npmjs.com/package/nodejieba) for accurate Chinese text segmentation
* [MATERIAL-UI](https://material-ui.com) for React components that implement Google's Material Design
* [Egor](https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929) for the React file drop zone tutorial


