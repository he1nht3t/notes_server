const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2]


const url = `mongodb://fullstack:${password}@ac-z2xr5ah-shard-00-00.issccat.mongodb.net:27017,ac-z2xr5ah-shard-00-01.issccat.mongodb.net:27017,ac-z2xr5ah-shard-00-02.issccat.mongodb.net:27017/note-app?ssl=true&replicaSet=atlas-4jc2ly-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to mongo')
    })
    .catch(err => {
        console.log(err.message)
    })


const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'CSS is hard',
    date: new Date(),
    important: true,
})


// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

Note.find({})
    .then( result => {
        result.forEach(n => {
            console.log(n)
        })
        mongoose.connection.close()
    } )
