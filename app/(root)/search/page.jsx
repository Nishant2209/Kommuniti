import UserCard from "@/components/card/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser({ userId: user?.id });
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user?.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="flex flex-col gap-9 mt-14">
        {result?.users?.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          result?.users.map((person) => (
            <UserCard
              key={person?.id}
              id={person?.userId}
              name={person.name}
              username={person?.username}
              imgUrl={person.image}
              personType="User"
            />
          ))
        )}
      </div>
    </section>
  );
};

export default page;
