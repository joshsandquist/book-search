// Imports for use in resolvers
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                //finding user by id
                const userData = await User.findOne({ _id: context.user._id})
                //removing password field
                .select('-__v -password')
                //populating saved books
                .populate('savedBooks');
                return userData
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });
    
          if (!user) {
            throw new AuthenticationError('Incorrect credentials');
          }
    
          const correctPw = await user.isCorrectPassword(password);
    
          if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
          }
    
          const token = signToken(user);
    
          return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
          const user = await User.create({ username, email, password });
    
          if (!user) {
            throw new Error('Something went wrong!');
          }
    
          const token = signToken(user);
    
          return { token, user };
        },
        saveBook: async (parent, { newBook }, context) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { savedBooks: newBook } },
              { new: true, runValidators: true }
            );
    
            return updatedUser;
          }
    
          throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId } } },
              { new: true }
            );
    
            if (!updatedUser) {
              throw new AuthenticationError("Couldn't find user with this id!");
            }
    
            return updatedUser;
          }
    
          throw new AuthenticationError('You need to be logged in!');
        },
      },
    };
    
    module.exports = resolvers;