import React from 'react';
import {Button, SafeAreaView} from 'react-native';

import {Header} from 'react-native/Libraries/NewAppScreen';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useLazyQuery,
} from '@apollo/client';
import {MOCK_CONTACTS_DATA} from './mock-data';

const TYPE_DEFS = gql`
  extend type Query {
    contacts: [Contact!]
  }
  type Contact {
    id: ID!
    name: String!
    thumbnailPath: String
    phoneNumbers: [ContactPhoneNumber!]!
  }
  type ContactPhoneNumber {
    id: ID!
    number: String!
    label: String!
  }
`;

const RESOLVERS = {
  Query: {contacts: () => MOCK_CONTACTS_DATA},
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  typeDefs: TYPE_DEFS,
  resolvers: RESOLVERS,
});

const ALL_CONTACTS_QUERY = gql`
  query AllContacts {
    contacts @client {
      id
      name
      phoneNumbers {
        id
        number
        label
      }
    }
  }
`;

function Content() {
  const [queryContacts] = useLazyQuery(ALL_CONTACTS_QUERY, {
    fetchPolicy: 'network-only',
  });

  const handlePress = async () => {
    const time = performance.now();
    await queryContacts();
    console.log('Query execution time:', performance.now() - time);
  };

  return <Button title="Run query" onPress={handlePress} />;
}

function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView>
        <Header />
        <Content />
      </SafeAreaView>
    </ApolloProvider>
  );
}

export default App;
