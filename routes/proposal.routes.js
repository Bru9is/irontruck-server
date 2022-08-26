import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import Proposal from '../models/Proposal.model.js'

const proposalRouter = Router()

proposalRouter.post('/new-proposal', isAuthenticated, attachCurrentUser, async (req, res)  => {
    try {
        const newProposal = req.body
        const company = req.currentUser

        if (company.role === 'company') {
            const proposalExist = await Proposal.find({postId: newProposal.postId, companyId: company._id})
            if (proposalExist.length > 0) {
                return res.status(400).send({ msg: 'Proposal already exists'})
            }
            const proposal = await Proposal.create({...newProposal, companyId: company._id})
            return res.status(201).json(proposal)
        }
        else return res.status(401).json({ msg: 'Only company can propose' });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

export default proposalRouter