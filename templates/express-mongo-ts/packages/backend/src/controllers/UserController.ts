import { Request, Response } from 'express'

import User from '../models/User'

const put = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body
    const user = new User({ name, email })

    await user.save().then()

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
const del = async (req: Request, res: Response) => {
  try {
    const { id } = req.body
    const user = await User.findById(id)

    if (user) {
      await user.remove()
    }

    return res.send()
  } catch (err) {
    console.error(err)
    return res.status(404).json({ error: 'User not found' })
  }
}

export { put, del }
