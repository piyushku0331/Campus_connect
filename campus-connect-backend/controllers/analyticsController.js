const User = require('../models/User');
const Event = require('../models/Event');
const Placement = require('../models/Placement');
const Post = require('../models/Post');




exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments({ isApproved: true });
    const placementCount = await Placement.countDocuments();
    const postCount = await Post.countDocuments();

    res.json({
      users: userCount,
      events: eventCount,
      placements: placementCount,
      posts: postCount
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};




exports.getPopularEvents = async (req, res) => {
  try {
    const popularEvents = await Event.aggregate([
      { $match: { isApproved: true } },
      {
        $project: {
          title: 1,
          date: 1,
          rsvpCount: { $size: '$attendees' }
        }
      },
      { $sort: { rsvpCount: -1 } },
      { $limit: 5 }
    ]);
    res.json(popularEvents);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};