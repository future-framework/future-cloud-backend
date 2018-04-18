module.exports = {
  async publishVersion(parent, { name, version, mainFileId, trainDataFileId }, ctx, info) {
    let fn = await ctx.db.query.fn({ where: { name } }, info)

    if (!fn) {
      fn = await ctx.db.mutation.createFn({ data: { name } }, info);
    }

    return ctx.db.mutation.createVersion({
      data: {
        fn: {
          connect: {
            id: fn.id,
          },
        },
        number: version,
        main: {
          connect: {
            id: mainFileId,
          },
        },
        trainData: {
          connect: {
            id: trainDataFileId,
          },
        },
      },
    },
    info);
  },
};
