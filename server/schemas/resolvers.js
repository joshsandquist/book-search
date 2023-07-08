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
    
}