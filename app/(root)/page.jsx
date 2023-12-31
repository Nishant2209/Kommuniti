import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ThreadCard from "@/components/card/ThreadCard";
import Pagination from "@/components/shared/Pagination";

import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";

async function Home({ searchParams }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser({ userId: user.id });
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchThreads(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  // console.log("results", result.threads[0].author);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result?.threads?.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.threads?.map((thread) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user.id}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;
