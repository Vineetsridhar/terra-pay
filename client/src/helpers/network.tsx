
export function getEndpoint(path: string) {
    return `http://localhost:8081/${path}`;
}

function getAuthToken(){
    //Get the id token from localstorage?
    const idToken = ""
    return {'authorization': `Bearer ${idToken}`}
}

function getCallParams(body: any) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthToken() },
        body: JSON.stringify(body)
    };
}

async function makeCall(callName: string, callParams: any):Promise<any> {
    return fetch(callName, getCallParams(callParams));
}

export async function createNewUser(username:string, name:string){
    const endpoint = getEndpoint('newUser');
    return makeCall(endpoint, {username, name}).then(response => response.json());
}

export async function isUsernameUnique(username:string){
    const endpoint = getEndpoint('isUsernameUnique');
    return makeCall(endpoint, {username}).then(response => response.json());
}

export async function getPaymentIntent(amount:number, paymentMethod:any){
    const endpoint = getEndpoint('payment');
    return makeCall(endpoint, {amount, paymentMethod}).then(response => response.json());
}