import { Request, Response } from 'express'

const get = (_req: Request, res: Response): void => {
  res.status(200).json({ message: 'Hello World!' })
}

export default {
  get,
}
