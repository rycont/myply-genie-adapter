import { generateURL, getPlaylistContent } from "."

getPlaylistContent("http://genie.co.kr/DCC7Z8")
  .then(generateURL)
  .then(console.log)
// findSongId({
//   artist: "세븐틴",
//   channelIds: {},
//   name: "Wave",
// }).then(console.log)
