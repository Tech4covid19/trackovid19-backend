'use strict'

const path = require('path')
const fs = require('fs')
const pdf = require('pdfjs');
const font = new pdf.Font(fs.readFileSync(path.join(__dirname, '../../../resources/PTMono-Regular.ttf')))


module.exports = async (fastify, opts) => {

  fastify.get('/token/generate/:entity', {}, async (request, reply) => {
    try {
      /* Code done in 1/2 hour, please don't judge its for a good cause */
      const external = new pdf.ExternalDocument(fs.readFileSync(path.join(__dirname, '../../../resources/doctorsDoc.pdf')))
      const doc = new pdf.Document()

      doc.setTemplate(external)
      const color = 0xffffff;
      const tokenArray = [];

      for (let i = 0; i < 5; i++) {
        tokenArray.push(fastify.genPatientToken());
      }

      // Left Side
      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 6.6 * pdf.cm, paddingTop: 0.95 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[0])

      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 6.6 * pdf.cm, paddingTop: 4.04 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[1])

      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 6.6 * pdf.cm, paddingTop: 4.13 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[2])

      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 6.6 * pdf.cm, paddingTop: 4.13 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[3])

      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 6.6 * pdf.cm, paddingTop: 4.13 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[4])

      // Right Side
      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 11.22 * pdf.cm, paddingTop: -20.77 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[0])

      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 11.22 * pdf.cm, paddingTop: 4.08 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[1])

      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 11.22 * pdf.cm, paddingTop: 4.12 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[2])

      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 11.22 * pdf.cm, paddingTop: 4.13 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[3])

      doc.cell({ paddingBottom: 1 * pdf.cm, paddingLeft: 11.22 * pdf.cm, paddingTop: 4.13 * pdf.cm })
        .text({
          fontSize: 9, color, font
        })
        .add(tokenArray[4])


      reply.type('application/pdf').send(doc)
      await doc.end()
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })


}