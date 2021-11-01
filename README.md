# Terra Pay 

Terra Pay was an application created for the 2021 Spring Drexel hackathon. It won both Organizer's choice as well as the Best Financial Hack awards. 

## Inspiration
Cryptocurrency is complicated. Everyone knows about crypto, but the barrier to entry is far too high for the average person to start using crypto currency in place of real money. Terra-Pay seeks to create an experience like Venmo to simplify the process of trading cryptocurrencies.

## What it does
Terra-Pay makes exchanging cryptocurrencies easy by providing a simple user interface while maintaining all the privacy and security of blockchain transactions. To get started with Terra-Pay, you simply create an account with a username and get assigned a wallet. This wallet is known only to you - not even our servers know about it!  To send money to your friend, you don't need your friends complicated wallet address. Simply send a friend request using your friend's username, and Terra-Pay will facilitate a secure transfer of both your addresses. Then with your friend's username, you can send money to them, without ever interacting with the blockchain!

## How we built it
We used react for the frontend and python/flask for our server. Ideally, we would have created a mobile application using React Native, however, given the time constraints, we believed it was best to use React.

## Challenges we ran into
One of the biggest challenges we faced was implementing Diffie Hellman key exchange. It required a lot of thinking on how we can implement it in the best way possible for the time frame. In addition, working with the Stripe API was a little challenging for us. We were new to the flow, so it took a lot of research to get accustomed to everything.

## Accomplishments that we're proud of
I think one of the things we felt most proud of was our implementation of cryptography. Every user has a Terra address that our server never touches. Using this model, all payments made on the application are not traceable by username. We used a Diffie-Hellman key exchange to establish a peer-to-peer exchange of Terra wallets. Then when both peers have each others wallets, they can freely send money to each other on the Terra blockchain.

## What we learned
Before coming into this hackathon, we had very little crypto currency knowledge, and even less cryptography knowledge. Using the Terra SDK docs, and some videos, we were able to learn how things are stored on the blockchain, and how we can make our own additions. In addition, after watching a lot of videos on peer-to-peer key exchanges, we were able to implement our own using React and Python.


https://devpost.com/software/terra-pay
