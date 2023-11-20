// Resource: https://docs.uploadthing.com/api-reference/react#generatereacthelpers
// Copy paste (be careful with imports)

import { generateReactHelpers } from "@uploadthing/react/hooks";

import { OurFileRouter } from "@/app/api/uploadthing/core";

const { useUploadThing, uploadFiles } = generateReactHelpers();

export { useUploadThing, uploadFiles };