"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";

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
    return await User.findOne({ userId });
    // .populate({
    //   path: "communities",
    //   model: Community,
    // });
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
