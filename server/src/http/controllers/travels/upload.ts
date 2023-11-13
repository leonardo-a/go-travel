import { FastifyReply, FastifyRequest } from 'fastify'

import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function upload(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file({
    limits: {
      fileSize: 5_242_880, // 5mb
    },
  })

  if (!file) {
    return reply.status(400).send()
  }

  const mimeTypeRegex = /^image\/[a-zA-Z]+/
  const isValidMimeType = mimeTypeRegex.test(file.mimetype)

  if (!isValidMimeType) {
    return reply.status(400).send()
  }

  console.log(file.filename)

  const fileId = randomUUID()
  const fileExtension = extname(file.filename)

  const fileName = fileId.concat(fileExtension)
  const writeStream = createWriteStream(
    resolve(__dirname, '../../../../images/travels/', fileName),
  )

  await pump(file.file, writeStream)

  const fullUrl = request.protocol.concat('://').concat(request.hostname)
  const fileUrl = new URL(`/images/travels/${fileName}`, fullUrl).toString()

  return reply.status(201).send({
    ok: true,
    fileUrl,
  })
}
