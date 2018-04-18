const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { apolloUploadExpress } = require('apollo-upload-server')
const bodyParser = require('body-parser')
const { S3 } = require('aws-sdk')
const fileApi = require('./modules/fileAPI')
const resolvers = require('./resolvers');

const getPrismaInstance = () => {
  return new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'https://eu1.prisma.sh/future/future-cloud-backend/dev', // the endpoint of the Prisma DB service
    secret: 'mysecret123', // specified in database/prisma.yml
    debug: true, // log all GraphQL queryies & mutations
  });
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: getPrismaInstance(),
  }),
})

const s3client = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  params: {
    Bucket: process.env.S3_BUCKET,
  },
})

server.express.post(
  '/upload',
  fileApi({
    s3: s3client,
    prisma: getPrismaInstance()
  })
)

server.start(() => console.log('Server is running on http://localhost:4000'))
