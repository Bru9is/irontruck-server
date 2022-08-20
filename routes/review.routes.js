import { Router } from 'express'

import isAuthenticated from '../middlewares/isAuthenticated.js'
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import Review from '../models/Review.model.js'

const reviewRouter = Router()

reviewRouter.post('/company/:id/reviews', isAuthenticated, attachCurrentUser, async (req, res) => {
        
    try {
        const user = req.currentUser
        const { id } = req.params
        const newReview = req.body

        if (user.companyIds.includes(id)) {
        const review = await Review.create({...newReview, userId: user._id, companyId: id})
            return res.status(201).json( review )
        }
        else return res.status(401).json({message: 'You are not authorized to post a reivew.'})

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal server Error'})
    }
})

reviewRouter.get('/company/:id/all-reviews', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const user = req.currentUser
        const { id } = req.params

        if (user.companyIds.includes(id)) {
            const allReviews = await Review.find()
            return res.status(200).json( allReviews )
        }
        else return res.status(401).json({message: 'You are not authorized to view reviews.'})

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal server Error'})
    }
})

reviewRouter.put('/reviews/:id', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const user = req.currentUser
        const { id } = req.params
        const review = await Review.findById(id)
        
        if(review.userId.toString() !== user._id.toString()) {
            return res.status(401).json({message: 'You are not authorized to post a reivew.'})
        }
        const reviewData = req.body
        const updatedReview = await Review.findOneAndUpdate(id, reviewData, {new: true})
        return res.status(200).json(updatedReview)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal server Error'})
    }
})

reviewRouter.delete('/reviews/:id', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const user = req.currentUser
        const { id } = req.params
        const review = await Review.findById(id)
        
        if(review.userId.toString() !== user._id.toString()) {
            return res.status(401).json({message: 'You are not authorized to delete this reivew.'})
        }
        await Review.findByIdAndDelete(id)
        return res.status(204).json({message: 'The review has been deleted.'})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal server Error'})
    }
})

export default reviewRouter