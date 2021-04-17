import React from "react";
import { LCDClient, Coin } from '@terra-money/terra.js';
import {Text} from '@fluentui/react'
import { globalStyles } from "../../assets/styles";

const terra = new LCDClient({
    URL: 'https://tequila-lcd.terra.dev/',
    chainID: 'tequila-0004',
});


export default function CreateAccount() {
    return (
        <div>
        <Text variant="xxLarge" styles={globalStyles.bold}>
        Welcome to TerraPay
      </Text>
      </div>
    )
}