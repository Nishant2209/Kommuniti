import ThreadCard from "@/components/card/ThreadCard";
import { fetchThread } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const result = await fetchThread(1, 30);
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser({ userId: user?.id });
  if (!userInfo?.onboarded) redirect("/onboarding");

  console.log(result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.threads.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      {/* <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      /> */}
    </>
  );
}
