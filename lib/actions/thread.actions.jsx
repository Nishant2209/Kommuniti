"use server";

import { User } from "lucide-react";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function createThreads({ props }) {
  const { text, author, communityId, path } = props;
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
