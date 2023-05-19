import { api } from "@/api/jiosaavn";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Album, AlbumArtist, Image, ImageQuality, Song } from "@/types";
import { store } from "@/store";
import { setHomeData } from "@/store/root-slice";

/**
 * Merges the given class names with the tailwind classes
 * @param inputs The class names to merge
 * @returns The merged class names
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Clears the given url of any special characters and replaces spaces with hyphens
 * @param url The url to clear
 * @returns The cleared url
 */
export const clearUrl = (url: string) =>
  url
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replaceAll(" ", "-")
    .replaceAll("--", "-");

/**
 * Converts the given string to base64
 * @param str The string to convert
 * @returns The converted string in base64
 */
export const strToBase64 = (str: string) => {
  const encodedStr = encodeURIComponent(str);

  return btoa(encodedStr);
};

/**
 * Converts the given base64 string to a normal string
 * @param base64 The base64 string to convert
 * @returns The converted string
 */
export const base64ToStr = (base64: string) => {
  const decodedStr = atob(base64);

  return decodeURIComponent(decodedStr);
};

/**
 * Checks if the given url is a valid JioSaavn link
 * @param url The url to check
 * @returns true if the url is valid
 */
export const isJioSaavnLink = (url: string) => {
  const regex =
    /^(https?:\/\/)?(www.)?jiosaavn\.com\/(song|shows|album|artist|featured)\/(.+)$/;

  return regex.test(url);
};

/**
 * Formats the given time in seconds to a formatted time string
 * @param time The time to format
 * @returns The formatted time string, eg: 3:45
 */
export const formatTime = (time: number | string) => {
  const minutes = Math.floor(Number(time) / 60);
  const seconds = Math.floor(Number(time) % 60);

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

/**
 * Gets the home data from the store (if available) or from the api
 * @returns The home data
 */
export const getHomeData = async () => {
  const rootSlice = store.getState().root;

  const homeData = rootSlice.homeData ?? (await api.getHomeData());

  homeData && (rootSlice.homeData ?? store.dispatch(setHomeData(homeData)));

  return (
    homeData && {
      trending: [...homeData.trending.albums, ...homeData.trending.songs],
      albums: homeData.albums,
      playlists: homeData.playlists,
      charts: homeData.charts,
    }
  );
};

/**
 * Gets the image of the given song or album
 * @param item The song or album to get the image of
 * @param quality The quality of the image to get
 * @returns The image link of the given song or album
 */
export const getImage = (image: Image, quality?: ImageQuality) => {
  if (typeof image == "boolean") return "/images/logo512.png";

  if (quality === "large") {
    return image[2].link;
  } else if (quality === "medium") {
    return image[1].link;
  } else if (quality === "small") {
    return image[0].link;
  }

  return image[2].link;
};

/**
 * Gets the artists of the given song or album
 * @param item The song or album to get the artists of
 * @returns The artists of the given song or album
 */
export const getArtists = (item: Song | Album) => {
  // @ts-ignore
  const { primaryArtists, featuredArtists, artists } = item;

  const getArtistsFromList = (artists: string | AlbumArtist[]) => {
    if (typeof artists === "string") {
      return artists.length ? artists.split(", ") : [];
    } else {
      return artists?.map((artist) => artist.name);
    }
  };

  const uniqueArtists = new Set<string>();

  const addArtistsToList = (artists: string[] | null) =>
    artists?.forEach((artist) => uniqueArtists.add(artist));

  addArtistsToList(getArtistsFromList(artists));
  addArtistsToList(getArtistsFromList(primaryArtists));
  addArtistsToList(getArtistsFromList(featuredArtists));

  return Array.from(uniqueArtists).join(", ");
};

/**
 * Gets the artist ids of the given song or album
 * @param item The song or album to get the artist ids of
 * @returns The artist ids of the given song or album
 */
export const getArtistIds = (item: Song | Album) => {
  const { primaryArtistsId, primaryArtists, featuredArtists } = item;

  const getArtistIdsFromList = (artists: string | AlbumArtist[]) =>
    typeof artists !== "string" ? artists?.map((artist) => artist.url) : null;

  return [
    ...primaryArtistsId.split(", "),
    ...(getArtistIdsFromList(primaryArtists) ?? []),
    ...(getArtistIdsFromList(featuredArtists) ?? []),
  ];
};

/**
 * Decodes the given html entities to normal text
 * @param str The string to decode
 * @returns The decoded string
 */
export const decodeHtml = (str: string) => {
  // const txt = document.createElement("textarea");
  // txt.innerHTML = html;

  // return txt.value;

  const txt = new DOMParser().parseFromString(str, "text/html");

  return txt.documentElement.textContent;
};

export enum SongQuality {
  low = "_12",
  medium = "_48",
  high = "_96",

  best = "_160",
  lossless = "_320",
}

/**
 * Downloads the given song with the given quality
 * @param song Song to download
 * @param quality Quality of the song to download
 */
export const downloadSong = async (song: Song, quality: SongQuality) => {
  const downloadLink = song.downloadUrl[0].link.replace(
    "_12.mp4",
    quality + ".mp4"
  );

  try {
    const response = await fetch(downloadLink);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const anchor = Object.assign(document.createElement("a"), {
      href: url,
      style: "display:none",
      download: `${decodeHtml(song.name)} ${song.year}.mp3`,
    });

    document.body.appendChild(anchor);
    anchor.click();

    URL.revokeObjectURL(url);
    anchor.remove();
  } catch (error) {
    console.error("Error occurred during download:", error);
  }
};
