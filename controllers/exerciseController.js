const { addExercise } = require("../utils/exerciseUtils");

const postExercise = async (req, res) => {
  const { _id: userId } = req.params;
  const { description, duration, date } = req.body;

  const exerciseDoc = await addExercise({ userId, description, duration, date });

  return res.status(201).send({
    _id: userId,
    username: exerciseDoc.username,
    date: exerciseDoc.date,
    duration: exerciseDoc.duration,
    description: exerciseDoc.description,
  });
};

module.exports = { postExercise };
