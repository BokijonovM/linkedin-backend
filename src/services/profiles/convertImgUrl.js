import ImageDataURI from "image-data-uri";

export const convertImageURL = async (imageUrl) => {
  const encodedUrl = await ImageDataURI.encodeFromURL(imageUrl);
  return encodedUrl;
};
