# StickerBox
A cross-platform desktop app featuring search, pick, save, and share stickers while chatting with others.

## Overview
StickerBox is an all-in-one solution for users to deal with sticker images while chatting with others on desktop apps such as Line, Slack, Messenger, ...etc. The application supports MacOS and Windows. With StickerBox, users can browse and search for stickers. To send a sticker, just drag it from StickerBox to desktop chatting apps. Besides browsing and searching, StickerBox also provides drag-and-upload feature, which allows users to upload local images to server and share with others. In summary, StickerBox covers all needs regarding to stickers in a desktop-chat settings.

* Note: due to the backend monolingual word-emdedding settings, StickerBox only supports **Chinese** so far.
* Disclaimer: this app provides features of uploading images in public domain. However, before you download and use it, please be noticed that you have to be leagally responsible for any kind of misusage regarding to copyrights. Please do not upload any images without permission of their own creator! (The default images of this project were from [Pixabay](https://pixabay.com/) -- A vibrant community of creatives, sharing copyright free images and videos)

## How to use

* Download the latest distributable of your platform from the [release](https://github.com/tom6311tom6311/midterm_sticker_box/releases) page

* On downloaded, unzip the file and you can run the resulting executable

* To search and browse:

![Alt Text](src/demo/browse.gif)

* To send:

![Alt Text](src/demo/send.gif)

* To upload:

![Alt Text](src/demo/upload.gif)

## Known issues
1. This app doesn't support drag stickers to Slack and Messenger directly so far, since they only accept local files to be dropped in. As a workaround, please drag the sticker to desktop, then drag it from desktop to Slack / Messenger.

## Framework used
* [React](https://reactjs.org/) - The web framework used
* [Node](https://nodejs.org/) - The backend runtime environment
* [Electron](https://electronjs.org/) - The framework used to build cross-platfrom Apps

## How to build
1. Please find a server machine and follow [this](https://github.com/tom6311tom6311/sticker_box_server) README to deploy the server
2. Exit the server and turn back to your local computer
3. Make sure you have Node (`^10.15.3`) and NPM (`^6.9.0`) installed
4. Clone [this](https://github.com/tom6311tom6311/midterm_sticker_box.git) project to your computer
5. `cd midterm_sticker_box`
6. `npm i`
7. In `src/const/AppConfig.const.js`, set `SERVER_URL` to `http://<your server's IP or domain>:5000`.
8. `npm start` to show in debugging mode
9. `npm run make` to generate executable for your platform

## Credits
* [Electron Forge](https://electronforge.io) for the Electron + React boilerplate
* [Kyubyong](https://github.com/Kyubyong/wordvectors) for the pre-trained word vectors
* [Pixaby](https://pixabay.com) for the high-quality copyright-free images
* [jieba](https://www.npmjs.com/package/nodejieba) for accurate Chinese text segmentation
* [MATERIAL-UI](https://material-ui.com) for React components that implement Google's Material Design
* [Egor](https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929) for the React file drop zone tutorial


## My Contribution
* Develop this app based on the frameworks described before. Basically speaking, I wrote client-side APP in React and server-side APP in Node.

## Thoughts
I have been faced with several technical difficulties during development of this app, some of them have been solved while others only been handled with workaround solutions so far:

* Searching: It takes me tons of hours to figure out how to search for files based on their descriptions. Finally, I use [jieba](https://www.npmjs.com/package/nodejieba) to segment a term into words and then use pre-trained word vectors provided by [Kyubyong](https://github.com/Kyubyong/wordvectors) to map these words to vectors. Then I sort the searching results based on the cosine-similarity metrics. This solution comes with a disadvantage -- the word embedding only supports one language; thus, only Chinese is supported so far.

* Drop-and-Upload: For users, this is an intuitive operation. However, it is not that simple from perspective of implementation. Following [Egor](https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929)'s tutorial, I wrap the main section with a `Dropzone` component, which detects if files are been dragged over it and shows animation accordingly. If a file from local system is dropped, upload functions should be triggered.

* Drag-out: When an image in the window is dragged, it is supposed to be sent to a chatting app. However, this behavior is highly similar to the one of Drop-and-Upload -- the dragged image also hovers over the `Dropzone`, which makes it difficult to distiguish the 2 behaviors. I inspect the problem for several hours, and finally solved it by putting conditions on the `dataTransfer.items` property of drag event.

* Copyright problems: This app reduces the complexity for users to keep and share stickers. However, this might also cause misusage and infringement of copyrights. I still have no effective solution on this problem. As a workaround, I design a checkbox for users to be self-confirmed that the image they want to upload has no copyright issues.