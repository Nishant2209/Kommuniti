"use server";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function createThreads({ text, author, communityId, path }) {
  connectToDB();

  const createdThread = await Thread.create({
    text,
    author,
    community: null,
  });

  //Update user model
  await User.findByIdAndUpdate(author, {
    $push: {
      threads: createdThread._id,
    },
  });

  revalidatePath(path);
}

export async function fetchThread(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const threadQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalThreadsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const threads = await threadQuery.exec();

  const isNext = totalThreadsCount > skipAmount + threads.length;

  return { threads, isNext };
}

export async function fetchThreadById(threadId) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      // .populate({
      //   path: "community",
      //   model: Community,
      //   select: "_id id name image",
      // }) // Populate the community field with _id and name 
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}
