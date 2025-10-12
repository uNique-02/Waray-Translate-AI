// setCookies.js

/**
 * Sets access and refresh tokens as HTTP-only cookies.
 * @param {import('express').Response} res - Express response object
 * @param {string} accessToken
 * @param {string} refreshToken
 */
function setAuthCookies(res, accessToken, refreshToken) {
  // Access token cookie (short-lived)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // use HTTPS in production
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token cookie (longer-lived)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export default setAuthCookies;
// export { setAuthCookies };
