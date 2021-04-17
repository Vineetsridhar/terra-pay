import React from "react";
import {
  Stack,
  Text,
  Link,
  FontWeights,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import logo from "./logo.svg";
import "./LoggedIn.css";
import { LCDClient, Coin } from "@terra-money/terra.js";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const stackTokens: IStackTokens = { childrenGap: 15 };

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const LoggedIn: React.FunctionComponent = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      styles={{
        root: {
          width: "960px",
          margin: "0 auto",
          textAlign: "center",
          color: "#605e5c",
        },
      }}
      tokens={stackTokens}
    >
      <Text variant="xxLarge" styles={boldStyle}>
        Welcome to TerraPay
      </Text>

      <Stack horizontal tokens={stackTokens} horizontalAlign="center">
        <DefaultButton href="/"> Create Account</DefaultButton>
        <PrimaryButton href="/loggedIn"> Import Account </PrimaryButton>
      </Stack>
    </Stack>
  );
};
