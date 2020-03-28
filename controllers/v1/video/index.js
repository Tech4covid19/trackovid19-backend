'use strict'

module.exports = async (fastify, opts) => {

  fastify.get('/video/all', {
    schema: {
      tags: ['video']
    }
  }, async (request, reply) => {
    try {
      const videosDB = await fastify.models().Videos.findAll({
        where: { available: true },
        order: [
          ['video_order', 'ASC']
        ],
        include: [
          {
            model: fastify.models().VideoShares, 
            where: { available: true }, 
            order: [
              ['share_order', 'ASC']
            ],
            required: false
          }
        ]
      });

      let videos = [];
      if (videosDB) {
        videos = videosDB.map(v => {
          let o = {
            id: v.id,
            title: v.title,
            description: v.description,
            video: v.video,
            share: null
          };
          if (v.video_shares) {
            o.share = o.share || {};
            v.video_shares.forEach(s => {
              o.share[s.target] = s.share_link
            });
          }
          return o;
       })
      }
      return videos;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send(sanitize_log(error, 'Could not get video list'));
    }
  })
}