import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import Proposal from '../models/Proposal.model.js'
import Post from '../models/Post.model.js'

const proposalRouter = Router()

proposalRouter.post('/new-proposal', isAuthenticated, attachCurrentUser, async (req, res)  => {
    try {
        const newProposal = req.body
        const company = req.currentUser

        if (company.role === 'company') {
            const proposalExist = await Proposal.find({post: newProposal.postId, company: company._id})
            if (proposalExist.length > 0) {
                return res.status(400).send({ msg: 'Proposal already exists'})
            }
            const proposal = await Proposal.create({...newProposal, company: company._id, post: newProposal.postId})
            return res.status(201).json(proposal)
        }
        else return res.status(401).json({ msg: 'Only company can propose' });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

proposalRouter.get('/:currentPostId/all-proposals', isAuthenticated, attachCurrentUser, async (req, res)  => {
    try {
        const { currentPostId } = req.params

        const postProposals = await Proposal.find({post : currentPostId}).populate('post').populate('company')
        console.log(postProposals)
        return res.status(200).json(postProposals)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }   
})

proposalRouter.put('/:proposalId/accept', isAuthenticated, attachCurrentUser, async (req, res)  => {
    try {
        const { proposalId } = req.params
        const foundProposal = await Proposal.findOneAndUpdate({_id : proposalId}, {status: 'accepted', acceptedAt: new Date()}, {new:true} )

        const postId = foundProposal.post._id
        await Post.findOneAndUpdate({_id: postId}, {status: 'inactive'})
        await Proposal.updateMany({post: postId, status: 'pending'}, {status: 'rejected'})

        return res.status(200).json(foundProposal)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

proposalRouter.get('/:proposalId/accept', isAuthenticated, attachCurrentUser, async (req, res)  => {
    try {
        const { proposalId } = req.params
        const foundProposal = await Proposal.findOne({_id : proposalId}).populate('company')
        return res.status(200).json(foundProposal)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

proposalRouter.put('/:proposalId/reject', isAuthenticated, attachCurrentUser, async (req, res)  => {
    try {
        const { proposalId } = req.params
        const foundProposal = await Proposal.findOneAndUpdate({_id : proposalId}, {status: 'rejected'}, {new:true} )

        return res.status(200).json(foundProposal)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

export default proposalRouter