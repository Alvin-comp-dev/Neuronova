import { createUploadthing, type FileRouter } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const f = createUploadthing();

// FileRouter for your app
export const ourFileRouter = {
  // Profile image uploader
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Get session for authentication
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        throw new Error("Unauthorized - Please sign in to upload files");
      }
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Here you could update the user's profile with the new image URL
      // await updateUserProfileImage(metadata.userId, file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Research document uploader
  researchDocument: f({ 
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
    image: { maxFileSize: "8MB", maxFileCount: 5 }
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        throw new Error("Unauthorized - Please sign in to upload documents");
      }
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Research document upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // General file uploader for discussions and community
  communityFile: f({ 
    image: { maxFileSize: "8MB", maxFileCount: 3 },
    pdf: { maxFileSize: "10MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        throw new Error("Unauthorized - Please sign in to upload files");
      }
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Community file upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 