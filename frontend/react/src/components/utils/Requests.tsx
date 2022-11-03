// function checkIfJSONisNotEmpty(obj: any) {
//   return Object.keys(obj).length > 0;
// }

async function Request(type: string, headers: any, body: any, url: string) {
  console.log(url);
  if (type === "GET") {
    const response: any = await fetch(url, {
      method: type,
      credentials: "include",
      headers: headers,
    });
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      return null;
    }
  } else {
    const response: any = await fetch(url, {
      credentials: "include",
      method: type,
      headers: headers,
      body: JSON.stringify(body),
    });
    console.log("response = ", response);
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  }
}

export default Request;
