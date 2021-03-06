const Publication = require('./../models/publication');

exports.getAllPublications = async (req, res, next) => {
  const publications = await Publication.find({});
  res.status(200).json(publications);
};

exports.postPublication = async (req, res, next) => {
  const newPublication = new Publication(req.body);
  newPublication.createdBy = req.user.id;
  try {
    const publication = await newPublication.save();
    res.status(201).json(publication);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.getPublicationById = async (req, res, next) => {
  const { publicationId } = req.params;
  try {
    const publication = await Publication.findById(publicationId);
    res.status(200).json(publication);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.updatePublication = async (req, res, next) => {
  const { publicationId } = req.params;
  try {
    await Publication.findByIdAndUpdate(publicationId, req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.deletePublication = async (req, res, next) => {
  const { publicationId } = req.params;
  try {
    await Publication.findByIdAndRemove(publicationId);
    res.status(200).json({ success: true });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.getPublicationsByLoggedInUser = async (req, res, next) => {
  try {
    const publications = await Publication.find({ createdBy: req.user.id });
    res.status(200).json(publications);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
