const Expense = require('../model/expense');
const User = require('../model/user'); 

exports.premiumFeature = async (req, res, next) => {
  try {
    const getuserLeaderBoard = await User.find()
      .select('name total_amount')
      .sort({ total_amount: -1 });

    res.status(200).json({ data: getuserLeaderBoard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err });
  }
};
