import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function agendaservicoRoutes(app: FastifyInstance) {
  app.get('/agendaservico', async (request, reply) => {
    try {
      const users = await prisma.agenda.findMany({
        include: {
          TipoServico: true,
          Estabelecimento: true,
          Recurso: true,
          Cliente: true,
        },
      })
      return reply.code(200).send(users)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return reply.code(500).send({ message: 'Erro ao buscar usuários.' })
    }
  })

  app.get('/agendaservico/:idagenda', async (request, reply) => {
    try {
      const paramsSchema = z.object({
        idagenda: z.string(),
      })

      // Validar parâmetros da solicitação
      const { idagenda } = paramsSchema.parse(request.params)

      // Converter o ID para número
      const id = parseInt(idagenda)

      // Verificar se o ID é um número válido
      if (isNaN(id)) {
        throw new Error('O ID da agenda deve ser um número válido.')
      }

      // Buscar o usuário no banco de dados
      const usercliente = await prisma.agenda.findUnique({
        where: {
          id,
        },
        include: {
          TipoServico: true,
          Estabelecimento: true,
          Recurso: true,
          Cliente: true,
        },
      })

      // Verificar se o usuário foi encontrado
      if (!usercliente) {
        reply.code(404).send({ message: 'Agenda não encontrado.' })
      }

      // Enviar resposta com o usuário encontrado
      return reply.code(200).send(usercliente)
    } catch (error) {
      console.error('Erro ao buscar Agenda:', error)
      // Enviar resposta de erro com código 400
      reply.code(400).send({ message: 'Erro ao buscar Agenda.' })
    }
  })

  app.get(
    '/agendaservicodiaestabelecimento/:id/:dia/:mes',
    async (request, reply) => {
      try {
        const querySchema = z.object({
          id: z.string(),
          dia: z.string(),
          mes: z.string(),
        })

        // Validar parâmetros da solicitação presentes na query da URL
        const { id, dia, mes } = querySchema.parse(request.params)

        const agendas = await prisma.agenda.findMany({
          where: {
            estabelecimentoId: parseInt(id),
            dia: parseInt(dia),
            mes: parseInt(mes),
          },
          include: {
            TipoServico: true,
            Estabelecimento: true,
            Recurso: true,
            Cliente: true,
          },
        })

        return reply.code(200).send(agendas)
      } catch (error) {
        console.error('Erro ao buscar agendas de serviço:', error)
        return reply
          .code(500)
          .send({ message: 'Erro ao buscar agendas de serviço.' })
      }
    },
  )

  app.post('/agendaservico', async (request, reply) => {
    try {
      // Validar o corpo da solicitação
      const bodySchema = z.object({
        dia: z.number(), // Validar se é um email válido
        mes: z.number(),
        ano: z.number(),
        horario: z.string(),
        estabelecimentoId: z.number(),
        tipoServicoId: z.number(),
        clienteId: z.number(),
        recursoId: z.number(),
      })
      const {
        dia,
        mes,
        ano,
        horario,
        estabelecimentoId,
        tipoServicoId,
        clienteId,
        recursoId,
      } = bodySchema.parse(request.body)

      // Criar um novo usuário no banco de dados
      const newAgenda = await prisma.agenda.create({
        data: {
          dia,
          mes,
          ano,
          horario,
          estabelecimentoId,
          tipoServicoId,
          clienteId,
          recursoId,
        },
      })

      // Enviar resposta com o novo usuário criado
      return reply.code(201).send(newAgenda)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      // Enviar resposta de erro com código 400
      reply.code(400).send({ message: 'Erro ao criar usuário.' })
    }
  })

  app.patch('/agendaservico/:idagenda', async (request, reply) => {
    try {
      // Validar o corpo da solicitação
      const paramsSchema = z.object({
        idagenda: z.string(),
      })

      const { idagenda } = paramsSchema.parse(request.params)

      const id = parseInt(idagenda)

      const bodySchema = z.object({
        dia: z.number(), // Validar se é um email válido
        mes: z.number(),
        ano: z.number(),
        horario: z.string(),
        estabelecimentoId: z.number(),
        tipoServicoId: z.number(),
        clienteId: z.number(),
        recursoId: z.number(),
      })
      const {
        dia,
        mes,
        ano,
        horario,
        estabelecimentoId,
        tipoServicoId,
        clienteId,
        recursoId,
      } = bodySchema.parse(request.body)

      // Criar um novo usuário no banco de dados
      const newAgenda = await prisma.agenda.update({
        where: {
          id,
        },
        data: {
          dia,
          mes,
          ano,
          horario,
          estabelecimentoId,
          tipoServicoId,
          clienteId,
          recursoId,
        },
      })

      // Enviar resposta com o novo usuário criado
      return reply.code(201).send(newAgenda)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      // Enviar resposta de erro com código 400
      reply.code(400).send({ message: 'Erro ao criar usuário.' })
    }
  })

  app.delete('/agendaservico/:idagenda', async (request, reply) => {
    try {
      // Validar parâmetros da solicitação
      const paramsSchema = z.object({
        idagenda: z.string(),
      })
      const { idagenda } = paramsSchema.parse(request.params)

      // Converter o ID para número
      const id = parseInt(idagenda)

      // Verificar se o ID é um número válido
      if (isNaN(id)) {
        throw new Error('O ID do agenda deve ser um número válido.')
      }

      // Excluir o usuário com base no ID fornecido
      const deleteAgenda = await prisma.agenda.delete({
        where: {
          id,
        },
      })

      // Verificar se o usuário foi excluído com sucesso
      if (!deleteAgenda) {
        return reply.code(404).send({ message: 'Recurso não encontrado.' })
      }

      // Enviar resposta com o usuário excluído
      return reply.code(200).send(deleteAgenda)
    } catch (error) {
      console.error('Erro ao excluir recurso:', error)
      // Enviar resposta de erro com código 400
      return reply.code(400).send({ message: 'Erro ao excluir recurso.' })
    }
  })
}
