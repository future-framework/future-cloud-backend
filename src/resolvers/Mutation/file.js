module.exports = {
  renameFile: async (parent, { id, name }, ctx, info) => {
    return ctx.db.mutation.updateFile({ data: { name }, where: { id } }, info)
  },
  deleteFile: async (parent, { id }, ctx, info) => {
    return await ctx.db.mutation.deleteFile({ where: { id } }, info)
  },
}
