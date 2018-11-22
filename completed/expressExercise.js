var express = require('express');
var app = express();

//speak funciotn
let animalSpeak = (animal)=>{
    switch (animal){
        case 'pig':
        return 'Oink';
        case 'cow':
        return 'Mob';
        case 'dog':
        return 'Woof Woof!';
        default:
        return "It'/s invalid input."
    }
}


// welcome router
app.get('/', (req, res) => {
    res.send('Hi there ! welcome to my assignment!');
})

// animal say router
app.get('/speak/:animal', (req,res)=>{
    res.send(`the ${req.params.animal} says ${animalSpeak(req.params.animal)}`)
})

// repeat router
app.get('/repeat/:word/:num', (req,res)=>{
    console.log(typeof +req.params.num)
    res.send(`${ (req.params.word + ' ').repeat(+req.params.num) }`)
})

//* router
app.get('*', (req,res)=>{
    res.send('sorry, page not found... What are you doing with your life?')
})

// Server listener
app.listen(3000, () => console.log('Server is preparing!!!'))