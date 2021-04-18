import { DefaultButton, Persona, PersonaSize, PrimaryButton, Stack, Text } from 'office-ui-fabric-react';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { globalStyles } from '../../assets/styles';
interface props {
    title: string,
    items: any,
    pending: boolean,
    acceptCallback: ((rec: string, sender: string, address: string) => void) | null,
    rejectCallback: ((sender: string, rec: string) => void) | null
}
export default function Container({ title, items, pending, acceptCallback, rejectCallback }: props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text variant="xxLarge">
                {title}
            </Text>
            <div
                style={{
                    ...{
                        alignItems: "center",
                        padding: "25px",
                        border: `4px solid ${globalStyles.colors.emphasis}`,
                        borderRadius: 10,
                    }, ...(
                        pending ? {
                            borderTopLeftRadius: 40,
                            borderBottomLeftRadius: 40,
                        } : {
                            borderTopRightRadius: 40,
                            borderBottomRightRadius: 40,
                        }
                    )
                }}
            >
                <Scrollbars autoHeight autoHeightMin={600}>
                    <Stack
                        styles={{
                            root: {
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "center",
                                overflow: "hidden",
                                height: "100%",
                            },
                        }}
                    >
                        {items.map(
                            (friend: any) => (
                                <Stack.Item
                                    styles={{
                                        root: {
                                            padding: 5,
                                        },
                                    }}
                                >
                                    <div
                                        style={{
                                            ...{
                                                width: 250,
                                                border: `2px solid ${globalStyles.colors.emphasis}`,
                                                boxShadow: "0 0 2px #9ecaed",
                                                borderRadius: 10,
                                                overflow: "hidden",
                                                height: 75,
                                                justifyContent: 'flex-end',
                                                display: 'flex'
                                            }, ...(pending ? {
                                                borderTopLeftRadius: 50,
                                                borderBottomLeftRadius: 50,
                                            } : {
                                                borderTopRightRadius: 50,
                                                borderBottomRightRadius: 50,
                                            })
                                        }}
                                    >
                                        <Persona
                                            text={pending ? friend.sender : friend.username}
                                            size={PersonaSize.size56}
                                            styles={{
                                                root: {
                                                    backgroundColor: globalStyles.colors.background2,
                                                    borderWidth: 2,
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: 2,
                                                    padding: 2,
                                                },
                                                primaryText: {
                                                    color: globalStyles.colors.text,
                                                },
                                            }}
                                        />
                                        {pending &&
                                            <div style={{
                                                display: 'flex',
                                                position: 'absolute',
                                                zIndex: 2, flexDirection:
                                                    'column',
                                                height: 75,
                                                justifyContent: 'space-around'
                                            }}>
                                                <PrimaryButton
                                                    onClick={() =>
                                                        acceptCallback!!(
                                                            friend.recipient,
                                                            friend.sender,
                                                            friend.decryptedAddress
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </PrimaryButton>
                                                <DefaultButton
                                                    onClick={() => rejectCallback!!(friend.sender, friend.recipient)}
                                                >
                                                    Reject
                                                </DefaultButton>
                                            </div>
                                        }
                                    </div>
                                </Stack.Item>
                            )
                        )}
                    </Stack>
                </Scrollbars>
            </div>
        </div >)
}