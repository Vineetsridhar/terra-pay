import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  Link,
  Label,
  TextField,
  FontWeights,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import { Separator } from "@fluentui/react/lib/Separator";
import "./AddFriends.css";
import { globalEmitter } from "../../helpers/emitter";
import { LCDClient, Coin, MnemonicKey } from "@terra-money/terra.js";
import { useHistory } from 'react-router-dom'
import { getFriendRequests, sendFriendRequest, getPublicKey, getPrimeNumber } from "../../helpers/network";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
interface FriendRequest {
  sender: string,
  recipient: string,
  address: string,
  decryptedAddress: string
}
const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const AddFriends: React.FunctionComponent = () => {
  const history = useHistory();
  const [friendUsername, setFriendUsername] = useState<string>("")
  const [allRequests, setAllRequests] = useState<FriendRequest[]>([])
  const bigInt = require("big-integer");
  const CryptoJS = require("crypto-js");

  const getRequests = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      history.push('/')
      return
    }
    const data = await getFriendRequests(username);
    const output: FriendRequest[] = []
    for (let i = 0; i < data.requests.length; i++) {
      const item: FriendRequest = data.requests[i]
      output.push({ ...item, decryptedAddress: (await decryptAddress(item.sender, item.address)) })
    }
    setAllRequests(output)
  }

  useEffect(() => {
    getRequests()
  }, [])

  const onChangeUsername = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      setFriendUsername(newValue);
    } else {
      setFriendUsername("");
    }
  }

  const decryptAddress = async (sender: string, address: string) => {
    const private_key = localStorage.getItem("private_key");
    const friendsPublicKey = await getPublicKey(sender);
    const prime = await getPrimeNumber();
    if (!private_key) {
      return
    }
    const shared = bigInt(friendsPublicKey.publicKey).modPow(parseInt(private_key), prime.value);
    return CryptoJS.AES.decrypt(address, shared.toString()).toString();
    
  }

  const handleFriendRequest = async () => {
    if (friendUsername != "") {
      const private_key = localStorage.getItem("private_key");
      const username = localStorage.getItem("username");
      if (!username || !private_key) {
        history.push('/');
        return;
      }
      const friendsPublicKey = await getPublicKey(friendUsername);
      if (!friendsPublicKey.publicKey) {
        globalEmitter.emit("notification", { type: "error", message: "The username you have input is invalid." });
        return;
      }
      const prime = await getPrimeNumber();
      // Calculate shared secret
      const shared = bigInt(friendsPublicKey.publicKey).modPow(parseInt(private_key), prime.value);

      const terraAddress = localStorage.getItem("address");
      const encryptedTerraAddress = CryptoJS.AES.encrypt(terraAddress, shared.toString()).toString();
      //console.log(encryptedTerraAddress);
      sendFriendRequest(username, friendUsername, encryptedTerraAddress);
      setFriendUsername("")
    }
    else {
      globalEmitter.emit("notification", { type: "error", message: "Please enter a valid username to send a friend request to." })
    }
  }

  return (
    <Stack>
      <Text variant="xxLarge" styles={boldStyle}>
        Please enter your friend's username:
      </Text>
      <TextField label="Username" onChange={onChangeUsername} />
      <PrimaryButton onClick={handleFriendRequest}>Send request</PrimaryButton>
      {allRequests.map(req => (
        <div>
          {`${req.sender} ${req.decryptedAddress}`}
        </div>
      ))}
    </Stack>
  );
};
