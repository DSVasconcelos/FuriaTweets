//import { MongoClient } from 'mongodb';  Se estiver usando .mjs
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://testFuria:testFuria@furia.ht8wkpp.mongodb.net/?retryWrites=true&w=majority&appName=Furia';

const client = new MongoClient(uri);

const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAFZT0wEAAAAA3fKHvcRzoLY6cH4oK4yk31wnsIk%3D4cmEViktbKszrX40sSid5R99q5ZI80BdbuhCqhFsmnzNS1YcUD';
const query = '@furia'
const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=3&tweet.fields=created_at,text,author_id`;

async function buscarTweets(url, bearerToken) {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${bearerToken}` }
    });
    const data = await res.json();
    console.log(data)
    return data.data || [];
  } catch (err) {
    console.error("❌ Erro na busca de tweets:", err);
    return [];
  }
}

async function salvarTweetsNoMongo(tweets) {
  try {
    await client.connect();
    const database = client.db("furiaDB");
    const collection = database.collection("tweets");

    const result = await collection.insertMany(tweets);
    console.log(`✅ ${result.insertedCount} tweets salvos no MongoDB`);
  } catch (err) {
    console.error("Erro ao salvar no MongoDB:", err.message);
  } finally {
    await client.close();
  }
}

async function processarTweets() {
  const tweets = await buscarTweets(url, bearerToken);
  if (tweets.length > 0) {
    console.log(`🔍 ${tweets.length} tweets encontrados.`);
    await salvarTweetsNoMongo(tweets);
  } else {
    console.log("❌ Nenhum tweet encontrado.");
  }
}

processarTweets();
