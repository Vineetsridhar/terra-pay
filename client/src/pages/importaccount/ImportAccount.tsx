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
import "./ImportAccount.css";
import { globalEmitter } from "../../helpers/emitter";
import { LCDClient, Coin, MnemonicKey } from "@terra-money/terra.js";
import logo from "../homepage/logo.svg";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const stackTokens: IStackTokens = { childrenGap: 15 };

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const ImportAccount: React.FunctionComponent = () => {

  const [mnemonicKey, setMnemonicKey] = useState<string>("")

  const onChangeMnemonic = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      setMnemonicKey(newValue);
    } else {
      setMnemonicKey("");
    }
    console.log(mnemonicKey);
  }


  const submit = () => {
    let currentMnemonic = mnemonicKey.split(" ");
    if (currentMnemonic.length == 12){
      const mk = new MnemonicKey({ mnemonic: mnemonicKey });
      const wallet = terra.wallet(mk);
      localStorage.setItem("mnemonic", mk.mnemonic);
      globalEmitter.emit("notification", { type: "success", message: "Mnemonic has successfully been imported." })
    }
    else{
      globalEmitter.emit("notification", { type: "error", message: "Please enter a mnemonic with valid length." })
    } 
  }

  return (
    <Stack>
      <Text variant="xxLarge" styles={boldStyle}>
        Please enter your 12-word seed phrase you received when creating a terra
        wallet (space between words).
      </Text>
      <TextField label="Mnemonic" onChange={onChangeMnemonic} multiline rows={3} placeholder="12 Word seed phrase" />
      <PrimaryButton onClick={submit}>Import</PrimaryButton>
    </Stack>
  );
};
