const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require("uuidv4")

// const { uuid } = require("uuidv4");
const app = express();
const repositories = [];

app.use(express.json());
app.use(cors());

function validateProjectId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid Project id"});
  }

  return next();
}


app.use('/repositories/:id', validateProjectId);
//Listar todos os dados
app.get("/repositories", (request, response) => {
  const { title } = request.query;
  return response.json(repositories);

});

//Adicionar dados 
app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0} = request.body;

  const repositorie = {id: uuid(), title, url, techs, likes};

  repositories.push(repositorie);

  return response.json(repositorie);
});

//Alterar title, url, techs.
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs, likes} = request.body;

  const repositorieIndex = repositories.findIndex(repositories => repositories.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error: "Project not found."})
  }
  
  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  }

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

//Deletar repositories
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositories => repositories.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error: "Project not found."})
  }

  repositories.splice(repositorieIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositories => repositories.id === id);
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories[repositorieIndex].likes++;

  return response.json(repositories[repositorieIndex])

});

module.exports = app;
