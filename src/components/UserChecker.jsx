import { useNavigate } from "react-router";
import { useEffect } from "react";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
const UserChecker = ({ onNewUser }) => {
  const navigate = useNavigate();
    useEffect(() => {      
    const client = new ApolloClient({
        uri: 'http://localhost:5005/graphql',
        cache: new InMemoryCache()
      });
      const query = gql`
        query {
        userSchemaIndex(first:1) {
          edges {
            node {
              id
              usename
              userAddress
            }
      }
    }
      }`;
      client.query({
        query: query
      }).then((data) => {
        // If no user exists
        if (data.data.userSchemaIndex.edges.length === 0) {
          onNewUser(true);
          navigate('/create-profile'); // Redirect to create-profile page
        }
        else {
          onNewUser(false);
          navigate('/posts'); // Redirect to posts page
        }
      }).catch((error) => console.error(error));
    }, [navigate, onNewUser]);
  
    return null; // This component does not render anything
  };