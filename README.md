# A Decentralized Social Network 



## Requirements
- The Host has to be running Linux. 
- Ceramic
- ComposeDB
- yarn


## To Run the Application

In the Terminal: 

- Clone Repository

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
    
    ```composedb composite:create Posts-schema-1.graphql --output=posts-schema-1-composite.json --did-private-key=your-private-key```
- Command to start the GraphQL Server

    ``` composedb graphql:server --ceramic-url=http://localhost:7007 --graphiql runtime-post-schema-composite.json --did-private-key=your-private-key --port=5005```




