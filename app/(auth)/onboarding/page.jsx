import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

const page = async () => {
  const user = await currentUser();

  const userInfo = {};

  const userData = {
    id: "Will come from db...",
    objectId: userInfo?.id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName + " " + user?.lastName || " ",
    bio: userInfo?.bio || " ",
    image: userInfo?.image || user?.imageUrl,
  };


  return (
    <main className="flex mx-auto max-x-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Kommuniti
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
};

export default page;
