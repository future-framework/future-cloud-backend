const uuid = require('uuid/v4')

const mime = require('mime-types')
const multiparty = require('multiparty')

module.exports = ({ prisma, s3 }) => (req, res) => {
  let form = new multiparty.Form()

  form.on('part', async function(part) {
    if (part.name !== 'data') {
      return
    }

    const name = part.filename
    const secret = uuid()
    const size = part.byteCount
    const contentType = mime.lookup(part.filename)

    try {
      // Upload to S3
      const response = await s3
        .upload({
          Key: secret,
          ACL: 'public-read',
          Body: part,
          ContentLength: size,
          ContentType: contentType,
        })
        .promise()

      const url = response.Location

      // Sync with Prisma
      const data = {
        name,
        size,
        secret,
        contentType,
        url,
      }

      const { id } = await prisma.mutation.createFile({ data }, ` { id } `)

      const file = {
        id,
        name,
        secret,
        contentType,
        size,
        url,
      }

      return res.status(200).send(file)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  })

  form.on('error', err => {
    console.log(err)
    return res.sendStatus(500)
  })

  form.parse(req)
}
