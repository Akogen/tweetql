import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

// Tweets sample data
let tweets = [
  {
    id: "1",
    text: "first one !",
    userId: "1",
  },
  {
    id: "2",
    text: "second one !!",
    userId: "2",
  },
  {
    id: "3",
    text: "Third one !!!",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "Andrew",
    lastName: "Jung",
  },
  {
    id: "2",
    firstName: "Austin",
    lastName: "Jung",
  },
  {
    id: "3",
    firstName: "Aidan",
    lastName: "Jung",
  },
];
// GraphQL Schema definition language(SDL)
const typeDefs = gql`
  """
  User object represents a resouce for a Author
  """
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the Sum of Fist name and last name as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resouce for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie!]!
    movie(id: String!): Movie
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Delete a Tweet if found, else return false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

// GET             /api/v1/tweets
// GET             /api/v1/tweet/:id

// POST DELETE PUT /api/v1/tweets

const resolvers = {
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(root, { text, userID }) {
      const exist = users.find((user) => user.id === userId);
      if (!userFind) throw new error("Not Found User ID.");

      const newTweet = {
        id: tweets.length + 1,
        text: text,
      };

      tweets.push(newTweet);

      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);

      if (!tweet) return false;

      tweets = tweets.filter((tweet) => tweet.id !== id);

      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
