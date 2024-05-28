import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { prisma } from './lib/db'

async function init () {
  const app = express()
  app.use(express.json())

  const gqlServer = new ApolloServer({
    typeDefs: `
     type Query{
        hello: String
        say(name:String): String
     }

     type Mutation{
      createUser(email:String!,password:String,firstName:String!,lastName:String!):Boolean
     }
    `, // Schema!
    resolvers: {
      Query: {
        hello: () => 'Hello',
        say: (_, { name }) => name + '5'
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password
          }: {
            firstName: string
            lastName: string
            email: string
            password: string
          }
        ) => {
          await prisma.user.create({
            data: {
              email,
              password,
              firstName,
              lastName,
              salt: 'uueu'
            }
          })
          return true
        }
      }
    }
  })

  await gqlServer.start()

  app.get('/', async (req: any, res: any) => {
    res.send('Hello world!')
  })

  app.use('/graphql', expressMiddleware(gqlServer))

  app.listen(8000, () => {
    console.log('Server is Running...')
  })
}

init()
