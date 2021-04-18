import React, {useState} from "react";
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
import logo from "../homepage/logo.svg";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const stackTokens: IStackTokens = { childrenGap: 15 };

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const AddFriends: React.FunctionComponent = () => {

  const [friendUsername, setFriendUsername] = useState<string>("")

  const onChangeUsername = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      setFriendUsername(newValue);
    } else {
      setFriendUsername("");
    }
  }

  const sendFriendRequest = () => {
    if(friendUsername != ""){

    }
    else{
      globalEmitter.emit("notification", { type: "error", message: "Please enter a valid username to send a friend request to." })
    }
  }

  return (
    <Stack>
      <Text variant="xxLarge" styles={boldStyle}>
        Please enter your friend's username:
      </Text>
      <TextField label="Username" onChange={onChangeUsername} />
      <PrimaryButton onClick={sendFriendRequest}>Send request</PrimaryButton>
    </Stack>
  );
};
