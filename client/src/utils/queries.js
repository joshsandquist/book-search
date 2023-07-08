import { gql } from '@apollo/client';
// Client side query to gather Loggeed in user data
// Will be used when saving books to a specific user's profile
export const GET_ME = gql`
  query {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;