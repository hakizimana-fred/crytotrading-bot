import express, { Application } from 'express'
import { CONFIG } from './config/config'
import { bybit } from './exchange/bybbit'

const app: Application = express()


const main  = async () => {

    app.use(express.json())

    app.get('/public/linear/kline', async (req, res) => {
       const { symbol }  = req.body
       const publicOrder = await bybit.getOrderBook({symbol}) 

        return res.status(200).json({success: true, data: publicOrder})
    })

    app.get('/wallet/balance', async (req, _res) => {
        const { coin } = req.body
        const ethBalance = await bybit.getWalletBallance({coin})

        console.log(ethBalance, 'My balance')
    })

    app.post('/private/linear/order/create', async (req, _res) => {
        const {side, price, symbol, order_type, qty } = req.body
        const myActiveOrder = await bybit.placeActiveOrder({
            side,
            symbol,
            order_type,
            qty,
            time_in_force: "GoodTillCancel",
            reduce_only: false,
            close_on_trigger: false,
            price,
        })

        console.log(myActiveOrder) 
    })

    app.listen(CONFIG.PORT, () => {
        console.log(`server starting on port ${CONFIG.PORT}`)
    })
}

main()
    .catch(e => console.log(e))
