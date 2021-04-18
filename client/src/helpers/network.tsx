export function getEndpoint(path: string) {
  return `http://localhost:8081/${path}`;
}

function getAuthToken() {
  //Get the id token from localstorage?
  const idToken = "";
  return { authorization: `Bearer ${idToken}` };
}

function getCallParams(body: any) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthToken() },
    body: JSON.stringify(body),
  };
}

async function makeCall(callName: string, callParams: any): Promise<any> {
  return fetch(callName, getCallParams(callParams));
}

export async function sendFriendRequest(
  sender: string,
  recipient: string,
  address: string
) {
  const endpoint = getEndpoint("initiateRequest");
  return makeCall(endpoint, { sender, recipient, address }).then((response) =>
    response.json()
  );
}

export async function denyFriendRequest(sender: string, recipient: string) {
  const endpoint = getEndpoint("denyRequest");
  return makeCall(endpoint, { sender, recipient }).then((response) =>
    response.json()
  );
}

export async function sendResponse(
  sender: string,
  recipient: string,
  address: string
) {
  const endpoint = getEndpoint("sendResponse");
  return makeCall(endpoint, { sender, recipient, address }).then((response) =>
    response.json()
  );
}

export async function createNewUser(
  username: string,
  name: string,
  publicKey: number
) {
  const endpoint = getEndpoint("newUser");
  return makeCall(endpoint, { username, name, publicKey }).then((response) =>
    response.json()
  );
}

export async function isUsernameUnique(username: string) {
  const endpoint = getEndpoint("isUsernameUnique");
  return makeCall(endpoint, { username }).then((response) => response.json());
}

export async function getPaymentIntent(amount: number) {
  const endpoint = getEndpoint("payment");
  return makeCall(endpoint, { amount }).then((response) => response.json());
}

export async function fundAccount(amount: number, address: string) {
  const endpoint = getEndpoint("fund");
  return makeCall(endpoint, { amount, address }).then((response) =>
    response.json()
  );
}

export async function getFriendRequests(username: string) {
  const endpoint = getEndpoint("getFriendRequests");
  return makeCall(endpoint, { username }).then((response) => response.json());
}

export async function getFriendResponses(username: string) {
  const endpoint = getEndpoint("getFriendResponses");
  return makeCall(endpoint, { username }).then((response) => response.json());
}

export async function getPublicKey(username: string) {
  const endpoint = getEndpoint("getPublicKey");
  return makeCall(endpoint, { username }).then((response) => response.json());
}

export async function getBaseNumber() {
  const endpoint = getEndpoint("getBaseNumber");
  return makeCall(endpoint, {}).then((response) => response.json());
}

export async function getPrimeNumber() {
  const endpoint = getEndpoint("getPrimeNumber");
  return makeCall(endpoint, {}).then((response) => response.json());
}

export async function getPoolAddress() {
  const endpoint = getEndpoint("getPoolAddress");
  return makeCall(endpoint, {}).then((response) => response.json());
}
