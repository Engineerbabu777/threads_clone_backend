
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init(){
    
const app = express();
app.use(express.json())

const gqlServer = new ApolloServer({
    typeDefs:`
     type Query{
        hello: String
        say(name:String): String
     }
    `,  // Schema!
    resolvers:{
        Query:{
            hello:()=> "Hello",
            say:(_,{name}) => name+"5"
        }
    }  
})

await gqlServer.start()

app.get("/", async(req:any,res:any) => {
    res.send("Hello world!")
})

app.use("/graphql", expressMiddleware(gqlServer))

app.listen(8000,() => {
    console.log("Server is Running...")
})
}

init()