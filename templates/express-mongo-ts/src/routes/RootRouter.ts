import { Router } from 'express'
import RootController from './../controllers/RootController'

const router = Router()

router.get('/', RootController.get)

export default router
