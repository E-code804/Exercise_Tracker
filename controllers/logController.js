const { getLogData } = require("../utils/logUtils");

const getLogs = async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const { logDocs, logs } = await getLogData(_id, from, to, limit);

  return res.json({
    _id: logDocs._id,
    username: logDocs.username,
    count: logs.length,
    log: logs,
  });
};

module.exports = { getLogs };
