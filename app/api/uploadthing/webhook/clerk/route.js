/* eslint-disable camelcase */
// Import statements
const { Webhook, WebhookRequiredHeaders } = require("svix");
const headers = require("next/headers");
const { IncomingHttpHeaders } = require("http");
const { NextResponse } = require("next/server");

// Functions imported from @/lib/actions/community.actions
const {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} = require("@/lib/actions/community.actions");

// Type definitions (converted to JavaScript comments for clarity)
// type EventType =
//   | "organization.created"
//   | "organizationInvitation.created"
//   | "organizationMembership.created"
//   | "organizationMembership.deleted"
//   | "organization.updated"
//   | "organization.deleted";

// type Event = {
//   data: Record<string, string | number | Record<string, string>[]>;
//   object: "event";
//   type: EventType;
// };

exports.POST = async (request) => {
  const payload = await request.json();
  const header = headers();

  const heads = {
    svixId: header.get("svix-id"),
    svixTimestamp: header.get("svix-timestamp"),
    svixSignature: header.get("svix-signature"),
  };

  // Activate Webhook in the Clerk Dashboard.
  // After adding the endpoint, you'll see the secret on the right side.
  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

  let evnt = null;

  try {
    evnt = wh.verify(JSON.stringify(payload), heads);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }

  const eventType = evnt?.type;

  // Handle organization creation event
  if (eventType === "organization.created") {
    // Extract relevant data from the event payload
    const { id, name, slug, logo_url, image_url, created_by } =
      evnt?.data ?? {};

    try {
      // Call the createCommunity function
      await createCommunity(
        id,
        name,
        slug,
        logo_url || image_url,
        "org bio",
        created_by
      );

      return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen member deletion event
  if (eventType === "organizationMembership.deleted") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
      // Show what evnt?.data sends from above resource
      const { organization, public_user_data } = evnt?.data;
      console.log("removed", evnt?.data);

      // @ts-ignore
      await removeUserFromCommunity(public_user_data.user_id, organization.id);

      return NextResponse.json({ message: "Member removed" }, { status: 201 });
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen organization updation event
  if (eventType === "organization.updated") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
      // Show what evnt?.data sends from above resource
      const { id, logo_url, name, slug } = evnt?.data;
      console.log("updated", evnt?.data);

      // @ts-ignore
      await updateCommunityInfo(id, name, slug, logo_url);

      return NextResponse.json({ message: "Member removed" }, { status: 201 });
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen organization deletion event
  if (eventType === "organization.deleted") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/DeleteOrganization
      // Show what evnt?.data sends from above resource
      const { id } = evnt?.data;
      console.log("deleted", evnt?.data);

      // @ts-ignore
      await deleteCommunity(id);

      return NextResponse.json(
        { message: "Organization deleted" },
        { status: 201 }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
};
