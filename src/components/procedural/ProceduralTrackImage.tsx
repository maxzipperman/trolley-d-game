import React, { useMemo } from "react";
import type { Tag } from "@/types";
import { StickFigure, Sign, ObjectPart } from "./parts";
import { ORDER, SOCIAL } from "@/utils/tags";

interface ProceduralTrackImageProps {
  tags: Tag[];
  seed?: number;
}

const WIDTH = 100;
const HEIGHT = 40;

function createRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function partForTag(tag: Tag) {
  if (ORDER.has(tag)) return Sign;
  if (SOCIAL.has(tag)) return StickFigure;
  return ObjectPart;
}

const ProceduralTrackImage: React.FC<ProceduralTrackImageProps> = ({ tags, seed = 1 }) => {
  const rng = useMemo(() => createRng(seed), [seed]);

  const elements = tags.map((tag, i) => {
    const Part = partForTag(tag);
    const x = rng() * (WIDTH - 20) + 10;
    const y = rng() * (HEIGHT - 20) + 10;
    return (
      <g key={i} transform={`translate(${x}, ${y})`}>
        <Part />
      </g>
    );
  });

  const label = `Track illustration${tags.length ? ` for ${tags.join(", ")}` : ""}`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
      className="text-foreground"
    >
      {elements}
    </svg>
  );
};

export default ProceduralTrackImage;
