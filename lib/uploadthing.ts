/* The generateReactHelpers function is used to generate the useUploadThing hook 
and the uploadFiles functions you use to interact with UploadThing in custom components. 
It takes your File Router as a generic

Generating components lets you pass your generic FileRouter once and then have typesafe components everywhere, 
instead of having to pass the generic everytime you mount a component, 
but you can also import the components individually from @uploadthing/react.

*/ 


import { generateReactHelpers } from "@uploadthing/react/hooks";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();