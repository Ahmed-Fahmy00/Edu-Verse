/**
 * EduVerse MongoDB Aggregation Pipelines
 * 
 * Copy and paste these directly into MongoDB Compass Aggregation tab
 * or run them in mongosh using: db.collection.aggregate([...])
 */

// ============================================================================
// PIPELINE 1: Course Engagement Analytics
// Collection: posts
// Purpose: Analyze engagement metrics per course (posts, comments, reactions)
// ============================================================================

db.posts.aggregate([
  // Group posts by courseId
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
  // Lookup comments for each course's posts
  {
    $lookup: {
      from: "comments",
      localField: "postIds",
      foreignField: "postId",
      as: "comments"
    }
  },
  // Lookup reactions for each course's posts
  {
    $lookup: {
      from: "reactions",
      localField: "postIds",
      foreignField: "postId",
      as: "reactions"
    }
  },
  // Lookup course details
  {
    $lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "_id",
      as: "courseInfo"
    }
  },
  // Unwind course info
  {
    $unwind: {
      path: "$courseInfo",
      preserveNullAndEmptyArrays: true
    }
  },
  // Project final fields
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
  // Sort by engagement score
  {
    $sort: { engagementScore: -1 }
  }
])



// ============================================================================
// PIPELINE 2: Top Contributors Leaderboard
// Collection: users
// Purpose: Rank users by their contributions (posts, comments, reactions)
// ============================================================================

db.users.aggregate([
  // Lookup posts created by each user
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "sender.id",
      as: "posts"
    }
  },
  // Lookup comments made by each user
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "sender.id",
      as: "comments"
    }
  },
  // Lookup reactions given by each user
  {
    $lookup: {
      from: "reactions",
      localField: "_id",
      foreignField: "senderId",
      as: "reactionsGiven"
    }
  },
  // Lookup reactions received on user's posts
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
  // Calculate contribution metrics
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
      // Contribution score: posts=5pts, comments=3pts, reactions=1pt
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
  // Sort by contribution score
  {
    $sort: { contributionScore: -1 }
  },
  // Limit to top 10
  {
    $limit: 10
  }
])



// ============================================================================
// PIPELINE 3: Reaction Distribution Analysis
// Collection: reactions
// Purpose: Analyze reaction types distribution across posts and time
// ============================================================================

db.reactions.aggregate([
  // Group by reaction type
  {
    $group: {
      _id: "$type",
      count: { $sum: 1 },
      uniqueUsers: { $addToSet: "$senderId" },
      uniquePosts: { $addToSet: "$postId" }
    }
  },
  // Lookup post details to get course info
  {
    $lookup: {
      from: "posts",
      localField: "uniquePosts",
      foreignField: "_id",
      as: "postDetails"
    }
  },
  // Calculate metrics
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
  // Sort by count
  {
    $sort: { totalCount: -1 }
  },
  // Add total summary using $facet
  {
    $group: {
      _id: null,
      reactions: { $push: "$$ROOT" },
      grandTotal: { $sum: "$totalCount" }
    }
  },
  // Final projection
  {
    $project: {
      _id: 0,
      grandTotal: 1,
      reactionBreakdown: "$reactions",
      mostPopularReaction: { $arrayElemAt: ["$reactions.reactionType", 0] }
    }
  }
])



// ============================================================================
// PIPELINE 4: Instructor Course Performance Report
// Collection: courses
// Purpose: Detailed analytics for instructor's courses with student engagement
// Note: Replace ObjectId("INSTRUCTOR_ID_HERE") with actual instructor ID
// ============================================================================

db.courses.aggregate([
  // Match courses by instructor (replace with actual ObjectId)
  // {
  //   $match: {
  //     instructorId: ObjectId("INSTRUCTOR_ID_HERE")
  //   }
  // },
  // Lookup all posts in each course
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "courseId",
      as: "coursePosts"
    }
  },
  // Lookup comments for course posts
  {
    $lookup: {
      from: "comments",
      localField: "coursePosts._id",
      foreignField: "postId",
      as: "courseComments"
    }
  },
  // Lookup reactions for course posts
  {
    $lookup: {
      from: "reactions",
      localField: "coursePosts._id",
      foreignField: "postId",
      as: "courseReactions"
    }
  },
  // Lookup instructor details
  {
    $lookup: {
      from: "users",
      localField: "instructorId",
      foreignField: "_id",
      as: "instructorInfo"
    }
  },
  // Calculate metrics
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
  // Sort by enrollment
  {
    $sort: { enrolled: -1 }
  }
])