const express = require('express')
const {uuid, isUuid} = require('uuidv4')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.json())

/**
 * Tipos http:
 * Query: Filtros e paginação
 * Params: Parametros da requisição
 * Body: Conteúdo da requisição
 */

/*
*Middlware
*/

function LogRequest(resquest,response,next){
    const {method,url} = resquest

    console.log(`[${method}]: ${url}`)
    return next()
}

function ValidateId(request,response,next){
    const {id} = request.params

    if(!isUuid(id)){
        return response.status(400).json({error:'Invalid project ID!'})
    }
    return next()
}

app.use(LogRequest)

const projects = []


app.get('/projects', (request, response) => {
    
    return response.json(projects)


})


app.post('/projects',(request, response) =>{
    
    const {title,message} = request.body
    const project = {id:uuid(),title:title,message:message}
    projects.push(project)

    return response.json(project)
})

app.put('/projects/:id',ValidateId,(request, response) =>{
    const {title,message} = request.query
    const {id} = request.params
    const projectsIndex = projects.findIndex(project => project.id === id )

    if ( projectsIndex < 0) response.status(400).json({error:"The project wasn't found." })
    
    const project = {
        id,
        title,
        message,
    }
    projects[projectsIndex] = project
    
    return response.json(project)
})

app.delete('/projects/:id',ValidateId,(request,reponse) =>{
    
    const {id} = request.params
    const projectsIndex = projects.findIndex(project => project.id === id )

    projects.splice(projectsIndex,1)
    return reponse.status(204).send()
})

app.listen(3000, () =>{
    return console.log('Back-end started!')
})