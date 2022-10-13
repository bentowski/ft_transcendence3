const getCookies = (key: string) => {
  const cookie = document.cookie
    .split(";")
    .filter((x) => x.trim().split("=")[0] === key)[0];
  if (!cookie) return "";
  return cookie.split("=")[1];
};
export { getCookies };
