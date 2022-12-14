import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import Post from '../models/Post.model.js'
import Proposal from '../models/Proposal.model.js'

const postRouter = Router()

postRouter.post('/new-post', isAuthenticated, attachCurrentUser, async (req, res)  => {
    try {
        const newPost = req.body
        const user = req.currentUser
        
        if (user.role === 'user') {
            const post = await Post.create({...newPost, userId: user._id})
            return res.status(201).json(post)
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
        const allPosts = await Post.find( {$and: [req.query, {status: {$ne: 'canceled'} } ] } )

        return res.status(200).json(allPosts)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

postRouter.get('/user-posts', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const user = req.currentUser
        const userPosts = await Post.find({$and: [{userId: user.id}, {status: {$ne: 'canceled'} } ] })
        
        return res.status(200).json(userPosts)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

postRouter.get('/user-posts/:postId', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const { postId } = req.params;
        const foundPost = await Post.findOne({$and: [{_id: postId}, {status: {$ne: 'canceled'} } ] })
        
        return res.status(200).json(foundPost)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})


postRouter.put("/edit-post/:postId", isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.currentUser._id;
        const foundPost = await Post.findOne({$and: [{_id: postId}, {status: {$ne: 'canceled'} } ] })
            
        if (foundPost && foundPost.userId.toString() === userId.toString()) {
                const updatedPost = await Post.findOneAndUpdate({$and: [{_id: postId}, {status: {$ne: 'canceled'} } ] }, req.body, { new: true })
                return res.status(200).json(updatedPost)
            } else {
                return res.status(401).json({ msg: 'You are not authorized to edit this post or the post doesn??t exist' })
            }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

postRouter.delete("/delete-post/:postId", isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.currentUser._id;
        const foundPost = await Post.findOne({_id: postId})

        if (foundPost && foundPost.userId.toString() === userId.toString()) {
                const deletedPost = await Post.findOneAndUpdate({_id: postId}, {status: "canceled"})
                const foundProposals = await Proposal.updateMany({post: postId}, {status: "rejected"})

                return res.status(204).json()
            } else {
                return res.status(401).json({ msg: 'You are not authorized to delete this post or the post doesn??t exist' })
            }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

export default postRouter