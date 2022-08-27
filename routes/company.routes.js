import { Router } from 'express' 
import User from '../models/User.model.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import Proposal from '../models/Proposal.model.js'

const companyRouter = Router()

companyRouter.get('/company/proposals', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const companyId = req.currentUser._id

        const companyProposals = await Proposal.find({company: companyId}).populate('post')
        console.log(companyProposals)
        return res.status(200).json(companyProposals)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: JSON.stringify(err) });
    }
})

export default companyRouter