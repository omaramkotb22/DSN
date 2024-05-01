import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:5005/graphql',
    cache: new InMemoryCache()
});

export const sendFriendRequest = async (currentUser, userAddress, proof) => {
    const addProof = gql`
        mutation AddProof($requesteeAddress: String!, $friendshipProof: String!, $requesterAddress: String!) {
            createFriendshipSchema_4(
                input: {
                    content: {
                        friendshipProof: $friendshipProof, 
                        requesteeAddress: $requesteeAddress, 
                        requesterAddress: $requesterAddress, 
                        status: PENDING
                    }
                }
            ) {
                document {
                    friendshipProof
                    id
                    requesteeAddress
                    requesterAddress
                    status
                }
            }
        }
    `;
    try {
        await client.mutate({
            mutation: addProof,
            variables: {
                requesterAddress: currentUser,
                requesteeAddress: userAddress,
                friendshipProof: proof
            }
        });
    } catch (error) {
        console.error('Error sending friend request: ' + error.message);
        throw error; // Rethrow to handle it in the component
    }
};
