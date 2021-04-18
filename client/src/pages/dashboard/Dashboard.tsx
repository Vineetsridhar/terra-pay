import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  FontWeights,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";
import { Separator } from "@fluentui/react/lib/Separator";
import "./Dashboard.css";
import CreateAccount from "../createaccount/CreateAccount";
import { HomePage } from "../homepage/HomePage";
import { LCDClient, Coin } from "@terra-money/terra.js";
import logo from "../homepage/logo.svg";
import { useHistory } from "react-router-dom";
import { AddFunds } from "../addfunds/AddFunds";
import { AddFriends } from "../addfriends/AddFriends";
import { SendMoney } from "../sendMoney/SendMoney";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const stackTokens: IStackTokens = { childrenGap: 15 };

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const Dashboard: React.FunctionComponent = () => {
  let { path, url } = useRouteMatch();
  const history = useHistory();
  const [balance, setBalance] = useState(0);

  const getBalanceData = async (address: string) => {
    const balance = await terra.bank.balance(address);
    console.log(balance.toArray());
  };

  useEffect(() => {
    const address = localStorage.getItem("address");
    if (!address) {
      history.push("/");
      return;
    }
    getBalanceData(address);
  }, []);
  return (
    <Stack horizontal styles={{ root: { height: "100%" } }}>
      <Stack.Item
        disableShrink
        styles={{
          root: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            width: "200px",
            height: "100%",
            borderRight: "2px solid grey",
          },
        }}
      >
        <Stack
          horizontalAlign="center"
          verticalAlign="start"
          verticalFill
          styles={{
            root: {
              margin: "0 auto",
              textAlign: "center",
              color: "#605e5c",
            },
          }}
          tokens={stackTokens}
        >
          <img className="App-logo" src={logo} alt="logo" />
          <Text variant="xxLarge" styles={boldStyle}>
            TerraPay
          </Text>
         
          <Separator />
          
          <DefaultButton href="/dashboard/addFunds">
            Deposit Funds
          </DefaultButton>
          <DefaultButton href="/dashboard/addFriends">
            Add Friends
          </DefaultButton>
          <DefaultButton href="/dashboard/sendMoney">Send Money</DefaultButton>
          <PrimaryButton href="/"> About </PrimaryButton>
        </Stack>
      </Stack.Item>

      <Stack.Item grow>
        <Switch>
          <Route path={`${path}/addFriends`}>
            <AddFriends />
          </Route>
          <Route path={`${path}/addFunds`}>
            <AddFunds />
          </Route>
          <Route path={`${path}/sendMoney`}>
            <SendMoney />
          </Route>
          <Route path={`${path}/`}>
            <HomePage />
          </Route>
        </Switch>
      </Stack.Item>
    </Stack>
  );
};
