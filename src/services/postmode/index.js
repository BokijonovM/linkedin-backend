//     POSTS:
//     - GET https://yourapi.herokuapp.com/api/posts/

//     Retrieve posts

//     - POST https://yourapi.herokuapp.com/api/posts/

//     Creates a new post

//     - GET https://yourapi.herokuapp.com/api/posts/{postId}

//     Retrieves the specified post

//     - PUT https://yourapi.herokuapp.com/api/posts/{postId}

//     Edit a given post

//     - DELETE https://yourapi.herokuapp.com/api/posts/{postId}

//     Removes a post

//     - POST https://yourapi.herokuapp.com/api/posts/{postId}

//     Add an image to the post under the name of "post"

//     #EXTRA: Find a way to return also the user with the posts, in order to have the Name / Picture to show it correcly on the frontend

// #EXTRA: Make unique endpoints for posting (BOTH text and image together)

import express from "express";
import createHttpError from "http-errors";
import PostModel from "./schema.js";
import q2m from "query-to-mongo";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const postRouter = express.Router();

const cloudinaryUplpoad = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `buildweek3`,
    },
  }),
}).single("image");

postRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body);
    await newPost.save();
    res.status(201).send({ newPost });
  } catch (error) {
    next(error);
  }
});

postRouter.get("/", async (req, res, next) => {
  try {
    const defaultQuery = {
      sort: "price",
      skip: 0,
      limit: 15,
    };
    const query = { ...defaultQuery, ...req.query };
    const mongoQeury = q2m(query);
    const total = await PostModel.countDocuments(mongoQeury.criteria);

    const posts = await PostModel.find(mongoQeury.criteria)
      .populate({
        path: "user",
        select: ["_id", "firstName", "surName", "image"],
      })
      .sort(mongoQeury.options.sort)
      .skip(mongoQeury.options.skip)
      .limit(mongoQeury.limit);
    res.status(200).send({
      links: mongoQeury.links("/posts", total),
      total,
      titalPagess: Math.ceil(total / mongoQeury.options.limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const foundPost = await PostModel.findById(postId);
    if (foundPost) {
      res.send(foundPost);
    } else {
      next(createHttpError(404), `post with given ${postId} not found`);
    }
  } catch (error) {
    next(error);
  }
});

postRouter.put("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const updatedPost = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(createHttpError(404, `post with given ${postId} not found`));
    }
  } catch (error) {
    next(createHttpError(500, `internal server problem`));
  }
});
postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (deletedPost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `post with given ${postId} not found`));
    }
  } catch (error) {
    next(createHttpError(500, "internal server problem"));
  }
});

postRouter.put("/:postId/image", cloudinaryUplpoad, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const updatePost = await PostModel.findByIdAndUpdate(
      postId,
      { image: req.file.path },
      {
        new: true,
      }
    );
    if (updatePost) {
      res.status(200).send(updatePost);
    } else {
      next(createHttpError(404, `post with given ${postId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

postRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const newComment = { ...req.body };

    const post = await PostModel.findByIdAndUpdate(postId);

    if (post) {
      const modifyPost = await PostModel.findByIdAndUpdate(
        postId,
        { $push: { comments: newComment } },
        { new: true }
      );
      res.status(201).send(modifyPost);
    } else {
      next(createHttpError(404, ` Nothing to comment`));
    }
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await PostModel.findById(postId);
    if (post) {
      res.send(post.comments);
    } else {
      next(
        createHttpError(404, `Post with Id ${req.params.postId} doesn't exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await PostModel.findById(postId);
    if (post) {
      const comment = post.comments.find(
        (c) => c._id.toString() === req.params.commentId
      );
      if (comment) {
        res.send(comment);
      } else {
        next(createHttpError(404, `Id ${req.params.commentId} not found`));
      }
    }
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const modifiedPost = await PostModel.findByIdAndUpdate(
      req.params.postId,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );
    if (modifiedPost) {
      res.status(204).send();
    } else {
      {
        next(createHttpError(404, `Id ${req.params.commentId} not found`));
      }
    }
  } catch (error) {}
});

postRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (post) {
      const index = post.comments.findIndex(
        (c) => c._id.toString() === req.params.commentId
      );

      if (index !== -1) {
        post.comments[index] = {
          ...post.comments[index].toObject(),
          ...req.body,
        };

        await post.save();
        res.send(post);
      } else {
        next(
          createHttpError(
            404,
            `Comment with id ${req.params.commentId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default postRouter;
