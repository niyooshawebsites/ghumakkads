"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { s3Client } from "@/lib/s3";

export async function getPresignedUrl(fileName: string, fileType: string) {
  const key = `posts/${randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return {
    uploadUrl,
    key,
  };
}
