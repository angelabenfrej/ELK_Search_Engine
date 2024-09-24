const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors())
const esClient = new Client({ node: 'http://localhost:9200' });
app.use(express.json());

async function checkServer(client) {
  try {
    await client.ping();
    console.log("Elasticsearch is running.");
  } catch (error) {
    console.error("Elasticsearch is not running.");
    throw error;
  }
}

app.post('/search', async (req, res) => {
  const { query } = req.body;

  try {
    await checkServer(esClient);

    const searchQuery = {
      index: 'flickrphotos', 
      body: {
        query: {
          match: {
            tags: {
              query: query,
              fuzziness: "AUTO"  
            }
          }
        }
      }
    };
    

    const results = await esClient.search(searchQuery);
    const images = results.hits.hits.map(hit => {
      const imageData = hit._source;
      return `http://farm${imageData.flickr_farm}.staticflickr.com/${imageData.flickr_server}/${imageData.id}_${imageData.flickr_secret}.jpg`;
    });
    res.json(images);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).send("Search error!");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
