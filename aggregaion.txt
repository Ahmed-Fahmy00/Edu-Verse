// PIPELINE 1: Course Engagement Analytics
// Collection: posts
// Purpose: Analyze engagement metrics per course (posts, comments, reactions)

db.posts.aggregate([
  {
    $group: {
      _id: "$courseId",
      totalPosts: { $sum: 1 },
      announcements: {
        $sum: { $cond: [{ $eq: ["$type", "announcement"] }, 1, 0] }
      },
      questions: {
        $sum: { $cond: [{ $eq: ["$type", "question"] }, 1, 0] }
      },
      discussions: {
        $sum: { $cond: [{ $eq: ["$type", "discussion"] }, 1, 0] }
      },
      postIds: { $push: "$_id" },
      uniqueContributors: { $addToSet: "$sender.id" }
    }
  },
  {
    $lookup: {
      from: "comments",
      localField: "postIds",
      foreignField: "postId",
      as: "comments"
    }
  },
  {
    $lookup: {
      from: "reactions",
      localField: "postIds",
      foreignField: "postId",
      as: "reactions"
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "_id",
      as: "courseInfo"
    }
  },
  {
    $unwind: {
      path: "$courseInfo",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $project: {
      courseId: "$_id",
      courseName: { $ifNull: ["$courseInfo.name", "General/Unknown"] },
      enrolled: { $ifNull: ["$courseInfo.enrolled", 0] },
      totalPosts: 1,
      announcements: 1,
      questions: 1,
      discussions: 1,
      totalComments: { $size: "$comments" },
      totalReactions: { $size: "$reactions" },
      uniqueContributors: { $size: "$uniqueContributors" },
      engagementScore: {
        $add: [
          { $multiply: ["$totalPosts", 3] },
          { $multiply: [{ $size: "$comments" }, 2] },
          { $size: "$reactions" }
        ]
      },
      avgCommentsPerPost: {
        $cond: [
          { $eq: ["$totalPosts", 0] },
          0,
          { $round: [{ $divide: [{ $size: "$comments" }, "$totalPosts"] }, 2] }
        ]
      }
    }
  },
  {
    $sort: { engagementScore: -1 }
  }
])

// PIPELINE 2: Top Contributors Leaderboard
// Collection: users
// Purpose: Rank users by their contributions (posts, comments, reactions)

db.users.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "sender.id",
      as: "posts"
    }
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "sender.id",
      as: "comments"
    }
  },
  {
    $lookup: {
      from: "reactions",
      localField: "_id",
      foreignField: "senderId",
      as: "reactionsGiven"
    }
  },
  {
    $lookup: {
      from: "reactions",
      let: { userPostIds: "$posts._id" },
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$postId", "$$userPostIds"] }
          }
        }
      ],
      as: "reactionsReceived"
    }
  },
  {
    $project: {
      name: 1,
      email: 1,
      role: 1,
      level: 1,
      postsCount: { $size: "$posts" },
      commentsCount: { $size: "$comments" },
      reactionsGivenCount: { $size: "$reactionsGiven" },
      reactionsReceivedCount: { $size: "$reactionsReceived" },
      questionsAsked: {
        $size: {
          $filter: {
            input: "$posts",
            as: "post",
            cond: { $eq: ["$$post.type", "question"] }
          }
        }
      },
      announcementsMade: {
        $size: {
          $filter: {
            input: "$posts",
            as: "post",
            cond: { $eq: ["$$post.type", "announcement"] }
          }
        }
      },
      contributionScore: {
        $add: [
          { $multiply: [{ $size: "$posts" }, 5] },
          { $multiply: [{ $size: "$comments" }, 3] },
          { $size: "$reactionsGiven" }
        ]
      },
      popularityScore: { $size: "$reactionsReceived" },
      memberSince: "$createdAt"
    }
  },
  {
    $sort: { contributionScore: -1 }
  },
  {
    $limit: 10
  }
])

// PIPELINE 3: Reaction Distribution Analysis
// Collection: reactions
// Purpose: Analyze reaction types distribution across posts and time

db.reactions.aggregate([
  {
    $group: {
      _id: "$type",
      count: { $sum: 1 },
      uniqueUsers: { $addToSet: "$senderId" },
      uniquePosts: { $addToSet: "$postId" }
    }
  },
  {
    $lookup: {
      from: "posts",
      localField: "uniquePosts",
      foreignField: "_id",
      as: "postDetails"
    }
  },
  {
    $project: {
      reactionType: "$_id",
      totalCount: "$count",
      uniqueUsersCount: { $size: "$uniqueUsers" },
      uniquePostsCount: { $size: "$uniquePosts" },
      coursesReached: {
        $size: {
          $setUnion: {
            $map: {
              input: "$postDetails",
              as: "post",
              in: "$$post.courseId"
            }
          }
        }
      },
      avgReactionsPerUser: {
        $round: [
          { $divide: ["$count", { $size: "$uniqueUsers" }] },
          2
        ]
      }
    }
  },
  {
    $sort: { totalCount: -1 }
  },
  {
    $group: {
      _id: null,
      reactions: { $push: "$$ROOT" },
      grandTotal: { $sum: "$totalCount" }
    }
  },
  {
    $project: {
      _id: 0,
      grandTotal: 1,
      reactionBreakdown: "$reactions",
      mostPopularReaction: { $arrayElemAt: ["$reactions.reactionType", 0] }
    }
  }
])

// PIPELINE 4: Instructor Course Performance Report
// Collection: courses
// Purpose: Detailed analytics for instructor's courses with student engagement
// Note: Replace ObjectId("INSTRUCTOR_ID_HERE") with actual instructor ID

db.courses.aggregate([
  // Match courses by instructor (replace with actual ObjectId)
  // {
  //   $match: {
  //     instructorId: ObjectId("INSTRUCTOR_ID_HERE")
  //   }
  // },
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "courseId",
      as: "coursePosts"
    }
  },
  {
    $lookup: {
      from: "comments",
      localField: "coursePosts._id",
      foreignField: "postId",
      as: "courseComments"
    }
  },
  {
    $lookup: {
      from: "reactions",
      localField: "coursePosts._id",
      foreignField: "postId",
      as: "courseReactions"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "instructorId",
      foreignField: "_id",
      as: "instructorInfo"
    }
  },
  {
    $project: {
      courseId: "$_id",
      courseName: "$name",
      description: 1,
      creditHours: 1,
      enrolled: 1,
      capacity: 1,
      instructors: {
        $map: {
          input: "$instructorInfo",
          as: "inst",
          in: { name: "$$inst.name", email: "$$inst.email" }
        }
      },
      enrollmentRate: {
        $round: [
          {
            $multiply: [
              { $divide: ["$enrolled", { $max: ["$capacity", 1] }] },
              100
            ]
          },
          1
        ]
      },
      totalPosts: { $size: "$coursePosts" },
      postsByType: {
        questions: {
          $size: {
            $filter: {
              input: "$coursePosts",
              as: "p",
              cond: { $eq: ["$$p.type", "question"] }
            }
          }
        },
        announcements: {
          $size: {
            $filter: {
              input: "$coursePosts",
              as: "p",
              cond: { $eq: ["$$p.type", "announcement"] }
            }
          }
        },
        discussions: {
          $size: {
            $filter: {
              input: "$coursePosts",
              as: "p",
              cond: { $eq: ["$$p.type", "discussion"] }
            }
          }
        }
      },
      totalComments: { $size: "$courseComments" },
      totalReactions: { $size: "$courseReactions" },
      uniqueContributors: {
        $size: {
          $setUnion: [
            { $map: { input: "$coursePosts", as: "p", in: "$$p.sender.id" } },
            { $map: { input: "$courseComments", as: "c", in: "$$c.sender.id" } }
          ]
        }
      },
      avgEngagementPerPost: {
        $cond: [
          { $eq: [{ $size: "$coursePosts" }, 0] },
          0,
          {
            $round: [
              {
                $divide: [
                  { $add: [{ $size: "$courseComments" }, { $size: "$courseReactions" }] },
                  { $size: "$coursePosts" }
                ]
              },
              2
            ]
          }
        ]
      }
    }
  },
  {
    $sort: { enrolled: -1 }
  }
])