import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  FontWeights,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import logo from "./logo.svg";
import "./HomePage.css";
import { LCDClient, Coin } from "@terra-money/terra.js";
import { useHistory } from "react-router-dom";
import { globalStyles } from "../../assets/styles";
import CreateAccount from "../createaccount/CreateAccount";
import { ImportAccount } from "../importaccount/ImportAccount";

const stackTokens: IStackTokens = { childrenGap: 15 };

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const HomePage: React.FunctionComponent = () => {
  const history = useHistory();
  const [displayedComponent, setDisplayedComponent] = useState("none");

  useEffect(() => {
    const address = localStorage.getItem("address");
    if (address) {
      history.push("/dashboard");
    }
  }, []);

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
      <img className="App-logo" src={logo} alt="logo" />
      <Text variant="xxLarge" styles={globalStyles.bold}>
        Welcome to TerraPay
      </Text>

      <Stack horizontal tokens={stackTokens} horizontalAlign="center">
        <DefaultButton
          onClick={() => {
            displayedComponent == "create"
              ? setDisplayedComponent("none")
              : setDisplayedComponent("create");
          }}
        >
          Create Account
        </DefaultButton>
        <PrimaryButton
          onClick={() => {
            displayedComponent == "import"
              ? setDisplayedComponent("none")
              : setDisplayedComponent("import");
          }}
        >
          Import Account
        </PrimaryButton>
      </Stack>
      {displayedComponent == "create" && <CreateAccount />}
      {displayedComponent == "import" && <ImportAccount />}
    </Stack>
  );
};
