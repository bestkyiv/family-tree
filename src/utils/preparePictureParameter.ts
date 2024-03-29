export const preparePictureParameter = (picture?: string): string | undefined => {
  if (!picture) return undefined;

  // workaround for loading images, see more at https://justin.poehnelt.com/posts/google-drive-embed-images-403/
  return picture.replace('drive.google.com', 'drive.lienuc.com');
};

export default preparePictureParameter;
