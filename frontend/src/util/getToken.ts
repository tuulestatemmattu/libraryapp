export const getToken = () =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
