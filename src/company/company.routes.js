import {Router} from 'express'
import { add, fltAtoZ, fltImpct, fltExpYr, fltZtoA, update, createExcel } from './company.controller.js'

const api = Router()

api.post('/add', add)
api.put('/update/:id', update)
api.get('/fltAtoZ', fltAtoZ)
api.get('/fltZtoA', fltZtoA)
api.get('/fltExpYr', fltExpYr)
api.get('/fltImpct', fltImpct)
api.get('/createExcel', createExcel)

export default api