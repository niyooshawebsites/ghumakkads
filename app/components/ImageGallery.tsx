"use client";

import { useMemo, useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";

import "react-photo-album/styles.css";
import "yet-another-react-lightbox/styles.css";

type PostImage = {
  id: string;
  imageUrl: string;
  alt?: string | null;
  order: number;
};

interface Props {
  images: PostImage[];
}

export function ImageGallery({ images }: Props) {
  const [index, setIndex] = useState(-1);

  const slides = useMemo(
    () =>
      images
        .sort((a, b) => a.order - b.order)
        .map((img) => ({
          src: img.imageUrl,
          alt: img.alt ?? "",
          width: 1200,
          height: 800,
        })),
    [images],
  );

  return (
    <>
      <PhotoAlbum
        layout="rows"
        photos={slides}
        spacing={8}
        targetRowHeight={250}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </>
  );
}
