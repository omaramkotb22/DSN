# A Decentralized Social Network 



## Requirements
- The Host has to be running Linux. 
- Ceramic
- ComposeDB
- yarn


## To Run the Whole Stack

In the Terminal: 

- Clone Repository

``` git clone ```

### Starting the Database
- Command to install Ceramic's CLI: 
    ```yarn add -g @ceramicnetwork/cli```
- Command to start Ceramic Node

    ``` ceramic daemon ```

- To generate your own Compose DB Private Key:

    ```composedb did:generate-private-key```

- To Generate the DID associated with the private key

    ```composedb did:from-private-key```

- Command to create your Composite
    
    ```composedb composite:create PostSchema_2.graphql --output=PostSchema_2-composite.json --did-private-key=your-private-key```

- Command to deploy your Composite
    ``` composedb composite:deploy --output=PostSchema_2-composite.json --ceramic-url=http://localhost:7007 --did-private-key=your-private-key ```

- Command to merge the Composite

``` composedb composite:merge composite_1.json composite_2.json --output=name-of-your-merged-composite.json```
- Command to compile your Composite

    ``` composedb composite:compile PostSchema_2-composite.json runtime-PostSchema-composite.json ```
￼
- Command to start the GraphQL Server

    ``` composedb graphql:server --ceramic-url=http://localhost:7007 --graphiql runtime-post-schema-composite.json --did-private-key=your-private-key --port=5005```



### Smart Contracts


- To Compile the Smart Contracts Run in the root dierectory the following command:

- For some reason, the most recent ethers does not work well with react-routers, for this I have to change from `ethers@6.0.2` to `ethers@5.7.2` when I need to run the React Application.
    
    ``` npx hardhat compile ```

- To Deploy the Smart Contract on Sepolia Testnet: 
    - Visit www.Alchemy.com
    - Login
    - Create new Project
    -  Run the following command from the root directory
        
        ```npx hardhat run scripts/deploy.js --network sepolia```

        Expected Output:
        
        ```PostContract deployed to: address_to_be_placed_as_the_contract_address```




### React Application

- In the Root Directory Run Command: 

``` yarn start ```

