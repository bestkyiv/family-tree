import cookie from 'react-cookies';

export const preparePictureParameter = (picture?: string): string | undefined => {
  if (!picture) return undefined;

  const cookieSpreadsheetId = cookie.load('spreadsheetId');

  const modifiedPicture = picture.replace(
    /drive\.google\.com\/file\/d\/([^/?]+)(?:\/[^?]*)?.*/,
    'gdrive-proxy.best-kyiv.org/$1',
  );

  return `${modifiedPicture}?api_key=${cookieSpreadsheetId}`;
};

export default preparePictureParameter;
