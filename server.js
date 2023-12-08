import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const PORT = process.env.PORT;

main().then(_ => console.log('Connected to MongoDB')).catch(err => console.log(err));
// mongoose
const listSchema = new mongoose.Schema({
  list: Array,
});

const List = mongoose.model('List', listSchema);

async function main(){
  await mongoose.connect(process.env.MONGO_URI);
}

// express
const app = express();
app.use(express.json()); // parses incoming json
app.use(cors({origin: 'http://localhost:3000'}))

let oldList;
app.get('/', async (req, res)=>{
  const list = await List.find({});
  return res.json({
    count: list.length,
    data: list
  });
})

app.get('/:id', async(req, res)=>{
  try{
    const {id} = req.params;
    const list = await List.findById(id);
    return res.json(list);
  }catch(error){
    console.log(error);
    res.status(500).send({message: error.message});
  }
});
 app.delete('/:id', async(req, res)=>{
  try{
    const {id} = req.params;
    const result = await List.findByIdAndDelete(id);

    if(!result) return res.status(404).json({message: "cannot find list"});

    res.status(200).json({message: "succesfully deleted list"});
  } catch (err) {
    console.log(err.message);
    res.status(500).json({message: err.message});
  }
})

app.put('/', async (req, res) => {
  try{
    const result = await List.deleteMany({});
    if(!result) return res.status(404).json({message: "unable to delete previous list"});
    const list = await List.create(req.body);

    return res.status(200).send(list);
  } catch (err){
    console.log(err.message);
    res.status(500).send({message: err.message});
  }
})

app.listen(PORT, _ => console.log(`Listening: PORT ${PORT}`));
