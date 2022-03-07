const Job = require('../models/job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');


const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userID }).sort('createAt');
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}

const getJob = async (req, res) => {
    const { user: { userID }, params: { id } } = req;
    const job = await Job.findOne({
        _id: id, createdBy: userID
    });
    if (!job) {
        throw new NotFoundError(`Job not found ${id}`);
    }
    res.status(StatusCodes.OK).json({ job });
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userID;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}

const updateJob = async (req, res) => {
    const { user: { userID }, params: { id }, body: { company, position } } = req;

    if (company === '' || position === '') {
        throw new BadRequestError('Company or position fields cannot be empty');
    }
    const job = await Job.findByIdAndUpdate({ _id: id, createdBy: userID }, req.body, { new: true, runValidators: true })
    if (!job) {
        throw new NotFoundError(`Job not found ${id}`);
    }
    res.status(StatusCodes.OK).json({ job });
}

const deleteJob = async (req, res) => {
    const { user: { userID }, params: { id } } = req;
    const job = await Job.findByIdAndRemove({ _id: id, createdBy: userID });
    if (!job) {
        throw new NotFoundError(`Job not found ${id}`);
    }
    res.status(StatusCodes.OK).json({ job });
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }