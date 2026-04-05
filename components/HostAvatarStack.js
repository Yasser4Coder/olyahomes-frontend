"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { hostAvatarPool, pickRandomHostAvatars } from "@/lib/hostAvatarPool";

const defaultTrio = hostAvatarPool.slice(0, 3);

export default function HostAvatarStack() {
  const [urls, setUrls] = useState(defaultTrio);

  useEffect(() => {
    setUrls(pickRandomHostAvatars(3));
  }, []);

  return (
    <div className="flex -space-x-3 [@media(max-height:640px)]:-space-x-2">
      {urls.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-zinc-200 shadow-sm ring-1 ring-zinc-200 [@media(max-height:640px)]:h-10 [@media(max-height:640px)]:w-10"
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      ))}
    </div>
  );
}
