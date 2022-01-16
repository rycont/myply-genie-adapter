import axios from "axios"
import { Adaptor, Playlist, Song } from "myply-common"

const endpoint = {
  search: (query: string) =>
    `https://www.genie.co.kr/search/searchAuto?query=${encodeURIComponent(
      query
    )}`,
}

export const findSongId = async (song: Song) => {
  return (await axios(endpoint.search(song.artist + " " + song.name))).data
    .song[0].id
}

export const generateURL = (playlist: Playlist) => {
  return Promise.resolve(
    `cromegenie://scan/?landing_type=31&landing_target=${playlist.tracks
      .map((e) => e.channelIds.genie)
      .join(";")}`
  )
}

export const getPlaylistContent = async (uri: string): Promise<Playlist> => {
  const text: string = (await axios(uri)).data
  const rawTracks = text
    .split("<tbody>")[1]
    .split("</tbody>")[0]
    .split("<tr")
    .slice(1)

  const tracks: Song[] = rawTracks.map((e) => {
    const id = e.split('songId="')[1].split('"')[0]
    const name = e
      .split('class="title ellipsis" title="')[1]
      .split('"')[0]
      .trim()
    const artist = e.split('; return false;" >')[3].split("</a")[0].trim()

    return {
      name,
      artist,
      channelIds: {
        genie: id,
      },
    }
  })

  const name = text
    .split('<h2 class="info__title">')[1]
    .split("</h2>")[0]
    .trim()

  const description = text
    .split('<p class="info__title--sub">')[1]
    .split("</p>")[0]
    .trim()

  return {
    name,
    preGenerated: {
      genie: uri,
    },
    description,
    tracks,
  }
}

export const GenieAdapter: Adaptor = {
  determinator: ["genie"],
  display: {
    color: "#0095FF",
    logo: `<svg width="50" height="24" viewBox="0 0 50 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_418_227)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.89234 5.01816C8.48136 4.67807 9.21146 5.06961 9.27383 5.72629L9.27813 5.81743V19.3258C9.27813 21.8821 7.1637 23.9618 4.56465 23.9618C3.25396 23.9618 1.99201 23.4187 1.10226 22.4717C0.523961 21.8562 0.554498 20.8888 1.1704 20.3109C1.7555 19.7619 2.65847 19.762 3.24312 20.291L3.33269 20.379C3.65105 20.7178 4.08861 20.9045 4.56465 20.9045C5.43702 20.9045 6.15379 20.2565 6.21447 19.4384L6.21863 19.3258V18.5138C5.73923 18.7596 5.21097 18.8992 4.63909 18.8992C2.13791 18.8992 0.0927273 16.911 0.00306546 14.433L0 14.2633V9.74822C0 7.19195 2.08106 5.11231 4.63909 5.11231C5.31374 5.11231 5.92773 5.30653 6.47235 5.6405L6.63365 5.74483L7.89234 5.01816ZM36.3564 4.89297C37.1629 4.89297 37.8236 5.51655 37.882 6.30755L37.8861 6.42164V17.3707C37.8861 18.215 37.2013 18.8994 36.3564 18.8994C35.55 18.8994 34.8893 18.2758 34.8309 17.4848L34.8267 17.3707V6.42164C34.8267 5.57735 35.5116 4.89297 36.3564 4.89297ZM27.6528 4.89297C30.1539 4.89297 32.1992 6.88126 32.2888 9.35919L32.2919 9.52888V17.3707C32.2919 18.215 31.607 18.8994 30.7622 18.8994C29.9557 18.8994 29.295 18.2758 29.2366 17.4848L29.2324 17.3707V9.52888C29.2324 8.65847 28.5238 7.95031 27.6528 7.95031C26.8197 7.95031 26.1351 8.59823 26.0772 9.41631L26.0732 9.52888V17.3707C26.0732 18.215 25.3883 18.8994 24.5434 18.8994C23.7371 18.8994 23.0763 18.2758 23.0179 17.4848L23.0137 17.3707V9.52888C23.0137 6.97266 25.0948 4.89297 27.6528 4.89297ZM16.1772 4.89296C18.6784 4.89296 20.7236 6.88125 20.8133 9.35918L20.8163 9.52887V10.8092C20.8163 11.7106 20.2314 12.4863 19.378 12.7399L19.248 12.7739L14.5976 13.833V14.2635C14.5976 15.134 15.3062 15.8421 16.1772 15.8421C16.7506 15.8421 17.2796 15.5281 17.5572 15.0328L17.6128 14.924C17.967 14.1576 18.876 13.8231 19.6429 14.1772C20.41 14.5311 20.7445 15.4394 20.3903 16.2059C19.6341 17.8422 17.9803 18.8995 16.1772 18.8995C13.6761 18.8995 11.6309 16.9112 11.5412 14.4332L11.5382 14.2635V9.52887C11.5382 6.97265 13.6193 4.89296 16.1772 4.89296ZM44.8548 4.89298C47.356 4.89298 49.4011 6.88126 49.4908 9.35919L49.4939 9.52888V10.8092C49.4939 11.7106 48.9089 12.4863 48.0555 12.7399L47.9256 12.7739L43.2752 13.833V14.2636C43.2752 15.134 43.9838 15.8421 44.8548 15.8421C45.4281 15.8421 45.9572 15.5281 46.2348 15.0329L46.2903 14.924C46.6447 14.1575 47.5535 13.8231 48.3205 14.1771C49.0875 14.5311 49.4221 15.4394 49.0679 16.2059C48.3116 17.8422 46.6579 18.8994 44.8548 18.8994C42.3537 18.8994 40.3085 16.9112 40.2188 14.4333L40.2157 14.2636V9.52888C40.2157 6.97267 42.2968 4.89298 44.8548 4.89298ZM4.63909 8.16965C3.8059 8.16965 3.12131 8.81757 3.06336 9.63565L3.05938 9.74822V14.2633C3.05938 15.1337 3.76803 15.8419 4.63909 15.8419C5.67409 15.8419 6.17402 15.0528 6.21577 14.263L6.21863 14.1554L6.21869 9.85682C6.21869 9.03251 5.72146 8.16965 4.63909 8.16965ZM16.1772 7.9503C15.3441 7.9503 14.6595 8.59822 14.6016 9.4163L14.5976 9.52887V10.6972L17.7568 9.97776V9.52887C17.7568 8.65846 17.0482 7.9503 16.1772 7.9503ZM44.8548 7.95031C44.0217 7.95031 43.3371 8.59824 43.2792 9.41632L43.2752 9.52888V10.6972L46.4344 9.97777V9.52888C46.4344 8.65848 45.7258 7.95031 44.8548 7.95031ZM36.3565 0.0542603C37.4073 0.0542603 38.2589 0.905337 38.2589 1.95536C38.2589 3.00561 37.4073 3.85658 36.3565 3.85658C35.3058 3.85658 34.454 3.00561 34.454 1.95536C34.454 0.905337 35.3058 0.0542603 36.3565 0.0542603Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_418_227">
<rect width="49.5" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
`,
    name: "지니",
  },
  findSongId,
  generateURL,
  getPlaylistContent,
}
