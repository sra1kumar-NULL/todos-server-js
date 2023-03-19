const express=require('express')
const bodyParser=require('body-parser')
const server=express()
const port=8000
server.use(bodyParser.urlencoded({
    'extended':true
}))
server.use(bodyParser.json())
var todoData=[{
    "id":1,
    "text":"work on todo-server",
    "isCompleted":false
}]
server.get('/',(req,res)=>{
   return  res.send('You hit the home route')
})
//get todos
server.get('/todos',(req,res)=>{
  return res.status(200).send(todoData)
})
//get a single todo with id
server.get('/todos/:id',(req,res)=>{
    const id=req.params.id
    const obtainedTodo=todoData.filter((todo)=>todo.id==id)
    return obtainedTodo.length!=0?res.status(200).send(obtainedTodo):res.status(404).send({'errMsg':`Todo with the ${id} is Not Found`})
})
//post a todo with data
server.post('/todos',(req,res)=>{
    const data=req.body
    if(data){
        todoData.push({id:Number(parseInt(Math.random()*100).toFixed(0)),
        text:data?.text,
        isCompleted:false
        })
    }
    return data?res.send({'msg':"data added successfully"}):res.send({'errMsg':"bad data send"})
})
//delete a todo
server.delete('/todos/:id',(req,res)=>{
    const {id}=req.params
    if(todoData.length!=0){
        const currentData=todoData.filter((todo)=>{
            if(todo.id!=id){
                return todo
            }
        })
        if(currentData.length!=0){
            todoData=currentData
            return res.send({'msg':'deleted item successfully'})
        }
    }
})
//update a todo
server.put('/todos/:id',(req,res)=>{
    const {id}=req.params
    const obtainedData=req.body
    if(obtainedData){
        const currentData=todoData.map((todo)=>{
            if(todo.id==id){
                let updatedTodo={
                    ...todo
                }
                //to update todo text
                if(obtainedData.text){
                     updatedTodo={...todo,text:obtainedData?.text}
                }
                // to mark todo as completed
                else{
                     updatedTodo={...todo,isCompleted:obtainedData?.isCompleted}
                }
                return updatedTodo
            }
            return todo
        })
        if(currentData){
            todoData=currentData
        }
        res.send(todoData).status(200)
    }
    else{
        res.send({'msg':'specify the data to update'})
    }
})
server.listen(port,()=>{console.log('server running on port',port)})