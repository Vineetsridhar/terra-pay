import React, {useState} from "react";
import { LCDClient, Coin } from '@terra-money/terra.js';
import { Text } from '@fluentui/react'
import { globalStyles } from "../../assets/styles";
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import "./CreateAccount.css";

const terra = new LCDClient({
    URL: 'https://tequila-lcd.terra.dev/',
    chainID: 'tequila-0004',
});


export default function CreateAccount() {

    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")

    return (
        <div>
            <Text variant="xxLarge" styles={globalStyles.bold}>
                Create an account
            </Text>
            <TextField label="Your name" />
            <TextField label="Username"/>
        </div>
    )
}