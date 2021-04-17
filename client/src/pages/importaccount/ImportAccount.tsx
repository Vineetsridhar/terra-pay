import React from "react";
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
import { LCDClient, Coin } from "@terra-money/terra.js";
import logo from "../homepage/logo.svg";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const stackTokens: IStackTokens = { childrenGap: 15 };

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const ImportAccount: React.FunctionComponent = () => {
  return (
    <Stack>
      <Text variant="xxLarge" styles={boldStyle}>
        Please enter your 12-word seed phrase you received when creating a terra
        wallet (space between words).
      </Text>
      <TextField label="Mnemonic" multiline rows={3} />
    </Stack>
  );
};
