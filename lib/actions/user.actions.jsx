"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Thread from "../models/thread.model";

const { connectToDB } = require("../mongoose");

export async function updateUser({ userId, name, username, bio, image, path }) {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { userId: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    // throw new Error(`Failed to create/update user: ${error.message}`);
    console.log(error);
  }
}

export async function fetchUser({ userId }) {
  try {
    connectToDB();
    return await User.findOne({ userId: userId });
    // .populate({
    //   path: "communities",
    //   model: Community,
    // });
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserThreads(userId) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}
