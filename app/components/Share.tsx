"use client";

import {
  FaFacebook,
  FaLinkedin,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
}

export function Share({ title }: Props) {
  const url =
    typeof window !== undefined ? `${process.env.NEXT_PUBLIC_SITE_URL}` : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
    linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const openShare = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => openShare(shareLinks.facebook)}
        variant={"outline"}
        className="cursor-pointer"
      >
        <FaFacebook className="text-blue-600 text-xl" />
      </Button>

      <Button
        onClick={() => openShare(shareLinks.x)}
        variant={"outline"}
        className="cursor-pointer"
      >
        <FaXTwitter className="text-xl" />
      </Button>

      <Button
        onClick={() => openShare(shareLinks.linkedIn)}
        variant={"outline"}
        className="cursor-pointer"
      >
        <FaLinkedin className="text-blue-700 text-xl" />
      </Button>

      <Button
        onClick={() => openShare(shareLinks.whatsapp)}
        variant={"outline"}
        className="cursor-pointer"
      >
        <FaWhatsapp className="text-green-500 text-xl" />
      </Button>

      <Button onClick={copyLink} variant={"outline"} className="cursor-pointer">
        <Copy size={20} />
      </Button>
    </div>
  );
}
