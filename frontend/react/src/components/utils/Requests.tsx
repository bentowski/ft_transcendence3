// function checkIfJSONisNotEmpty(obj: any) {
//   return Object.keys(obj).length > 0;
// }

async function Request(type: string, headers: any, body: any, url: string) {
  console.log(url);
  if (type === "GET") {
    const settings = {
      method: type,
    };
    const response: any = await fetch(url, settings);
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } else {
    const settings = {
      method: type,
      headers: headers,
      body: JSON.stringify(body),
    };
    const response: any = await fetch(url, settings);
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  }
}

export default Request;
