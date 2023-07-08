// Imports for use in resolvers
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    // Query for gathering a user profile
    Query: {
        //Doesn't take in any args but does require context
        me: async (parent, args, context) => {
            if (context.user) {
                //finding user by id using mongoose findOne method
                const userData = await User.findOne({ _id: context.user._id})
                //removing password field for security reasons
                .select('-__v -password')
                //populating saved books to User profile
                .populate('savedBooks');
                return userData
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        //Mutation to log in a user
        //Takes in email and password as args
        login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });
        //generalized error if no user is found
          if (!user) {
            throw new AuthenticationError('Incorrect credentials');
          }
          // using bcrypts password checking method
          const correctPw = await user.isCorrectPassword(password);
    
          if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
          }
          
          //if sucessful login, sign token and return user and token
          const token = signToken(user);
    
          return { token, user };
        },
        // Mutation for adding a user to db
        // Takes in username, email, and password as args
        addUser: async (parent, { username, email, password }) => {
          const user = await User.create({ username, email, password });
            
          if (!user) {
            throw new Error('Something went wrong!');
          }
          // sign token and return if sucessful
          const token = signToken(user);
    
          return { token, user };
        },

        //mutation to save book to a user profile
        // taking in an argument of newBook
        saveBook: async (parent, { newBook }, context) => {
        //checking user authentication before adding book
          if (context.user) {
            // using mongoose findOneAndUpdate method to add newBook to Users savedBooks array
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { savedBooks: newBook } },
              //returning the updated file
              { new: true}
            );
    
            return updatedUser;
          }
    
          throw new AuthenticationError('You need to be logged in!');
        },
        //mutation to remove book from user savedBooks array
        removeBook: async (parent, { bookId }, context) => {
    
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              // using mongoose $pull method to remove book with specified id from the array
              { $pull: { savedBooks: { bookId } } },
              //return updated data
              { new: true }
            );

            return updatedUser;
          }
    
          throw new AuthenticationError('You need to be logged in!');
        },
      },
    };
    
    module.exports = resolvers;