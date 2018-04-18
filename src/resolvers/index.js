const file = require('./Mutation/file')
const publishVersion = require('./Mutation/publishVersion')

module.exports = {
  Query: {
    file: async (parent, { id }, context, info) => {
      return context.db.query.file({ where: { id } }, info)
    },
    files: async (parent, args, context, info) => {
      return context.db.query.files(args, info)
    },
  },
  Mutation: {
    ...file,
    ...publishVersion,
  },
}
