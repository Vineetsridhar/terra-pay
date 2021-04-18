import os
import asyncio
from dotenv import load_dotenv, find_dotenv
from terra_sdk.client.lcd import AsyncLCDClient, LCDClient
from terra_sdk.key.mnemonic import MnemonicKey
from terra_sdk.core import Coins
from terra_sdk.core.auth import StdFee
from terra_sdk.core.bank import MsgSend

load_dotenv(find_dotenv())  
private_key = os.getenv('MNEMONIC')

if private_key != "" and private_key is not None:
    mk = MnemonicKey(private_key)
else:
    print("Missing mnemonic in environmental variables")
    exit()

async def fund_wallet(recipient, amount):
    await asyncio.sleep(1)
    terra = LCDClient(url="https://tequila-lcd.terra.dev", chain_id="tequila-0004")
    wallet = terra.wallet(mk)

    # Check if funding wallet has enough funds.
    public_address = wallet.key.acc_address
    balances = terra.bank.balance(public_address)
    current_balance = balances.get('uusd')
    current_amount = float(current_balance.to_data()['amount'])/1000000
    # convert amount to string
    '''
    string_builder = ""
    recipient_amount_list = str(amount).split('.')
    recipient_amount = recipient_amount_list[0]

    string_builder += recipient_amount
    if int(recipient_amount_list[1]) != 0:
        string_builder += recipient_amount_list[1]
        i = 6-len(recipient_amount_list[1])
        for x in range(i):
            string_builder += "0"    
    else:
        string_builder += "000000"
    '''

    # Process funding
    if amount/100 <= current_amount:
        tx = wallet.create_and_sign_tx(
        msgs=[MsgSend(
            wallet.key.acc_address,
            recipient,
            str(int(amount*10000)) + "uusd" # send amount in UST
        )],
        memo="Funding from Terra-Pay wallet",
        fee=StdFee(3000000, "3000000uusd")
        )
        result = terra.tx.broadcast(tx)
        print(result)
    else:
        print("Amount is greater than funding wallet balance.")
