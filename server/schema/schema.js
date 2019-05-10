const graphql = require('graphql');
const _ = require('lodash');
// Destructure out the GraphQLObjectType
const { GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

// Dummy Data
var books = [
  { name: 'Name of the wind', genre: 'Fantasy', id: "1", authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: "2", authorId: '2' },
  { name: 'The Long Earth', genre: 'SciFi', id: "3", authorId: '3' },
  { name: 'The Hero of Ages', genre: 'Fantasy', id: "4", authorId: '2' },
  { name: 'The Colour of Magic', genre: 'Fantasy', id: "5", authorId: '3' },
  { name: 'The Light Fantastic', genre: 'Fantasy', id: "6", authorId: '3' }
]

var authors = [
  { name: "Patrick Rothfuss", age: 44, id: '1' },
  { name: "Brandon Sanderson", age: 42, id: '2' },
  { name: "Terry Pratchett", age: 66, id: '3' }
]



// Let's define the object type of Books!
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.authorId })
      }
    }
  })
});

// Let's define the object type of Author!
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id })
      }
    }
  })
})

// Let's jump onto the third task of the schema file, defining root queries, wihch define how the user can jump into the graph to grab data.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // Code to get data from db / other source
        // Note that this resolve function is fired off when someone tries to get a book.
        return _.find(books, { id: args.id }); // use lodash to look through the books array and return any book that has an id equal to the id sent along with args when the user asked for the book.
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id })
      }
    }
  }
})
// book(id: '123'){
//   name
//   genre
// }

module.exports = new GraphQLSchema({
  query: RootQuery
})


/**
 * We've grabbed all these different properties from the graphql package
 * We've defined our first object type, which is a Book type.
 * This book type has different fields, id, name and genre.
 * We're also defining a RootQuery, which is how we initially jump into the graph
 * The fields property defines all the various ways that we can jump into the graph.
 * Exported the resulting schema
 */
