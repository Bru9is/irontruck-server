import { Router } from 'express'

import isAuthenticated from '../middlewares/isAuthenticated.js'
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import Post from '../models/Post.model.js'

const postRouter = Router()

postRouter.post('/new-post', isAuthenticated, attachCurrentUser, async (req, res)  => {
    try {
        const newPost = req.body
        const user = req.currentUser

        if (user.role === 'user') {
            const post = await Post.create(newPost)
            return res.status(201).json(newPost)
        }
        else return res.status(401).json({ msg: 'Only users can post' });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

postRouter.get('/all-posts', isAuthenticated, async (req, res) => {
    try {
        const allPosts = await Post.find()
        return res.status(200).json(allPosts)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

export default postRouter

