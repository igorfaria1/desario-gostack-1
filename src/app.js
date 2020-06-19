const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const data = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(data);
  response.json(data);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id == id);

  if (index < 0) {
    return response.status(400).json({ message: `Repository id (${id}) not found.` });
  }

  const repository = repositories[index];

  if (title) 
    repository.title = title;

  if (url)
    repository.url = url;
  
  if (techs && techs.length > 0) 
    repository.techs = techs;
    
  repositories[index] = repository;

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const index = repositories.findIndex(repo => repo.id == id);

  if (index < 0) {
    return response.status(400).json({ message: `Repository id (${id}) not found.` });
  }

  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const index = repositories.findIndex(repo => repo.id == id);

  if (index < 0) {
    return response.status(400).json({ message: `Repository id (${id}) not found.` });
  }

  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
