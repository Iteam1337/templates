import { Router } from 'express'
import * as UserController from './../controllers/UserController'

const router = Router()

router.put('/', UserController.put)
router.delete('/', UserController.del)

export default router
