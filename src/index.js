const express = require('express')
const cors = require('cors')
const connection = require('./database')
const { validarProducto } = require('./schemas/products')


const app = express()

const port = 4321

app.use(express.json())
app.use(cors())


//obtener productos
app.get("/obtenerProductos", async (req, res) => {
    try {
        const promisePool = connection.promise();
        const [rows, fields] = await promisePool.query('select * from products');
        res.json(rows)
    } catch (error) {
        res.status(500).json({ mensaje: "Ha ocurrido un error" })
    }
})

app.get("/obtenerProducto/:id", async (req, res) => {
    try {
        const { id } = req.params
        const promisePool = connection.promise();
        const [rows, fields] = await promisePool.query('select * from products where id = ?', [id]);
        res.json(rows)
    } catch (error) {
        res.status(500).json({ mensaje: "Ha ocurrido un error" })
    }
})

app.delete("/borrarProducto/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (Number(id)) {
            const promisePool = connection.promise();
            const [rows, fields] = await promisePool.query('delete from products where id = ?', [id]);
            if (rows.affectedRows > 0) {
                res.json({ mensaje: 'Eliminado correctamente' })
            } else {
                res.status(500).json({ error: 'No se pudo eliminar' })
            }
        } else {
            res.status(400).json({ error: 'El id debe ser un valor numerico' })
        }

    } catch (error) {
        res.status(500).json({ mensaje: "Ha ocurrido un error" })
    }
})

app.put("/actualizarProducto", async (req, res) => {
    try {
        const data = req.body

        if (Number(data.id)) {
            if (validarProducto(data)) {
                const promisePool = connection.promise();
                const [rows, fields] = await promisePool.execute('update products set title = ?, price = ?, description = ?, category = ?, image = ? where id = ?', [data.title, data.price, data.description, data.category, data.image, data.id]);
                if (rows.affectedRows > 0) {
                    res.json({ mensaje: 'Actualizado correctamente' })
                } else {
                    res.status(500).json({ error: 'No se pudo actualizar' })
                }
            }
        } else {
            res.status(400).json({ error: 'El id debe ser un valor numerico' })
        }
    } catch (error) {
        res.status(500).json({ mensaje: "Ha ocurrido un error" })
    }
})

app.post("/crearProducto", async (req, res) => {
    try {
        const data = req.body

        if (validarProducto(data)) {
            const promisePool = connection.promise();
            const [rows, fields] = await promisePool.execute('insert into products (id, title, price, description, category, image) values (?, ?, ?, ?, ?, ?)', [data.id, data.title, data.price, data.description, data.category, data.image]);
            if (rows.affectedRows > 0) {
                res.json({ mensaje: 'Creado correctamente' })
            } else {
                res.status(500).json({ error: 'No se pudo crear' })
            }
        } else {
            res.status(400).json({ error: 'El id debe ser un valor numerico' })
        }
    } catch (error) {
        res.status(500).json({ mensaje: "Ha ocurrido un error" })
    }
})


app.listen(port, () => console.log(`Servidor ejecutandose en el puerto ${port}`))