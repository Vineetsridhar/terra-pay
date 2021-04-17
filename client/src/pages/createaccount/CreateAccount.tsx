import React from "react";
import { LCDClient, Coin } from '@terra-money/terra.js';


const terra = new LCDClient({
    URL: 'https://tequila-lcd.terra.dev/',
    chainID: 'tequila-0004',
});


export default function CreateAccount() {
    return (
        <div>Hello</div>
    )
}