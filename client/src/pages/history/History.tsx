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
import "./History.css";
import { globalEmitter } from "../../helpers/emitter";
import { LCDClient, Coin, MnemonicKey } from "@terra-money/terra.js";
import { useHistory } from 'react-router-dom'
import { getFriendRequests, sendFriendRequest, getPublicKey, getPrimeNumber, sendResponse, denyFriendRequest } from "../../helpers/network";

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

export const History: React.FunctionComponent = () => {
  const history = useHistory();
  const [friendUsername, setFriendUsername] = useState<string>("")
  const [mnemonic, setMnemonicKey] = useState<string>("")
  const [allRequests, setAllRequests] = useState<FriendRequest[]>([])
  const bigInt = require("big-integer");
  const CryptoJS = require("crypto-js");


  useEffect(() => {
    const mnemonicKey = localStorage.getItem('mnemonic');
    if(mnemonicKey)
      setMnemonicKey(mnemonicKey);
  }, [])

  return (
    <Stack>
      <Text variant="small" styles={boldStyle}>
        Your address: {localStorage.getItem("address")}
      </Text>
      <Text variant="xxLarge" styles={boldStyle}>
        History
      </Text>
    </Stack>
  );
};
