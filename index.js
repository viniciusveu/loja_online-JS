const express = require("express")
const fs = require('fs')
const faker = require("faker")
const path = require('path')
    //const expressLayouts = require("express-ejs-layouts")


const cart = []
const stock = []
const categories = []

const app = express()
const port = 8080

app.set('view engine', 'ejs')
    //app.set('views', path.join(__dirname, 'views'));


app.get('/:categoria?', (req, res) => {
    const cat = req.params.categoria

    let stockObj = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    if (!stock.length) {
        stockObj.forEach(element => {
            stock.push(element)
            categories.push(element.categoria)
        })
    }
    //console.log(cat)
    if (cat == null || cat == undefined) {
        return res.render('pages/home', { stockObj, cart, categories, filter: null })
    } else {
        return res.render('pages/home', { stockObj, cart, categories, filter: cat })
    }

})

app.get("/add/:cat/:id", (req, res) => {
    const cat = req.params.cat
    const id = req.params.id

    cart.forEach((element, index) => {
        if (element.prod.id == id)
            element.qnt++
    })

    stock.forEach(category => {
        if (category.categoria == cat) {
            //console.log(category.produtos)
            category.produtos.forEach(prod => {
                if (prod.id == id) {

                    cart.push({ prod, qnt: 1 })
                }
            })
        }
    })
    return res.redirect('/')
})

app.get("/rm/:cat/:id", (req, res) => {
    const cat = req.params.cat
    const id = req.params.id

    stock.forEach(category => {
        if (category.categoria == cat) {
            //console.log(category.produtos)
            category.produtos.forEach((prod, index) => {
                if (prod.id == id) {
                    cart.splice(index, 1)
                }
            })
        }
    })
    return res.redirect('/')
})

app.get("/cart", (req, res) => {

    return res.render('pages/cart', { cart })
})

app.use(express.static(__dirname + '/public'))
app.listen(port)