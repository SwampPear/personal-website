'use client'

import Image from 'next/image'
import { useState } from 'react'

// `aspect` is the image's native width / height. Baked in so the hover-resize
// always grows the cell to the image's true shape — no async measurement, no
// square-default flash that crops portrait covers before they load.
type Photo = { src: string; title: string; caption: string; aspect: number }

const PHOTOS: Photo[] = [
  { src: '/images/me.png', title: 'Fuji Heiwa Park', caption: 'Shizuoka', aspect: 1.002 },
  { src: '/images/checkered_strat.png', title: 'Maple-Walnut Checkered Strat', caption: 'Luthiery Project', aspect: 0.549 },
  { src: '/images/porco_rosso.png', title: 'Porco Rosso', caption: 'Studio Ghibli', aspect: 0.667 },
  { src: '/images/breezin.jpg', title: 'Breezin\'', caption: 'George Benson', aspect: 1.0 },
  { src: '/images/georgia_sunshine.png', title: 'Georgia Sunshine', caption: 'Jerry Reed', aspect: 0.964 },
  { src: '/images/mother_earths_plantasia.png', title: 'Mother Earth\'s Plantasia', caption: 'Mort Garson', aspect: 1.0 },
  { src: '/images/last_chance_to_see.jpg', title: 'Last Chance to See', caption: 'Douglas Adams', aspect: 0.639 },
  { src: '/images/allans_wing.png', title: "Allan's Wing Pizza", caption: 'Rocky Mountain Pizza, Atlanta', aspect: 1.480 },
  { src: '/images/being_so_normal.jpeg', title: 'Being So Normal', caption: 'Peach Pit', aspect: 1.0 },
  { src: '/images/bifana.png', title: 'Bifana', caption: 'O Trevo, Lisbon', aspect: 1.059 },
  { src: '/images/field_guide_to_north_american_birds.png', title: 'Field Guide to North American Birds', caption: 'Audubon Society', aspect: 0.530 },
  { src: '/images/hairy_lemon.jpg', title: 'The Hairy Lemon', caption: 'The Hairy Lemon, Dublin', aspect: 0.750 },
  { src: '/images/the_autobiography_of_benjamin_franklin.jpg', title: 'The Autobiography of Benjamin Franklin', caption: 'Benjamin Franklin', aspect: 0.667 },
  { src: '/images/sea_window.jpg', title: 'Window to the Sea', caption: 'Atlantic coast', aspect: 0.75 },
  { src: '/images/miradouro_buskers.jpeg', title: 'Buskers at the Miradouro', caption: 'Lisbon', aspect: 0.75 },
  { src: '/images/telephone_box.jpg', title: 'Red Telephone Box', caption: 'Scotland', aspect: 0.75 },
  { src: '/images/autumn_avenue.jpg', title: 'Autumn Avenue', caption: 'Central Park, New York', aspect: 0.75 },
]

const COLS = 5
const ROWS = Math.ceil(PHOTOS.length / COLS)

// Fraction of the dominant axis the hovered cell should occupy. The other axis
// is derived from the image's aspect ratio so the grown cell matches the image
// exactly — no cropping, no letterboxing.
const TARGET = 0.52

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

// fr value that makes a single track occupy `frac` of its axis, given the other
// (count - 1) tracks each stay at 1fr.
const toFr = (frac: number, count: number) => (frac * (count - 1)) / (1 - frac)

// Column / row fr for the hovered cell so its shape equals the image aspect.
// Base cells are square (container aspect = COLS/ROWS), so aspect >= 1 grows
// width-first and aspect < 1 grows height-first.
function cellFrs(aspect: number): [number, number] {
  let colFrac: number
  let rowFrac: number
  if (aspect >= 1) {
    colFrac = TARGET
    rowFrac = (TARGET * COLS) / (ROWS * aspect)
  } else {
    rowFrac = TARGET
    colFrac = (TARGET * aspect * ROWS) / COLS
  }
  return [Math.max(toFr(colFrac, COLS), 1), Math.max(toFr(rowFrac, ROWS), 1)]
}

export default function PhotoGrid() {
  const [hovered, setHovered] = useState<number | null>(null)

  const hoverCol = hovered === null ? null : hovered % COLS
  const hoverRow = hovered === null ? null : Math.floor(hovered / COLS)
  const [colFr, rowFr] =
    hovered === null ? [1, 1] : cellFrs(PHOTOS[hovered].aspect)

  const tracks = (active: number | null, fr: number, count: number) =>
    Array.from({ length: count }, (_, i) => (i === active ? `${fr}fr` : '1fr')).join(' ')

  return (
    <figure className="mt-10">
      <div
        style={{
          display: 'grid',
          aspectRatio: `${COLS} / ${ROWS}`,
          gap: '6px',
          gridTemplateColumns: tracks(hoverCol, colFr, COLS),
          gridTemplateRows: tracks(hoverRow, rowFr, ROWS),
          transition: `grid-template-columns 600ms ${EASE}, grid-template-rows 600ms ${EASE}`,
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            onMouseEnter={() => setHovered(i)}
            className="relative overflow-hidden rounded-[3px] border border-white/10 bg-white/[0.02]"
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="(max-width: 640px) 60vw, 360px"
              className={`object-cover transition-opacity duration-300 ease-out ${
                hovered === null || hovered === i ? 'opacity-100' : 'opacity-60'
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/70 to-black/20 p-3 transition-opacity duration-300 ease-out ${
                hovered === i ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="font-serif text-[12px] tracking-[0.08em] text-foreground">
                {photo.title}
              </span>
              <span className="font-serif text-[11px] tracking-[0.08em] text-[var(--muted)]">
                {photo.caption}
              </span>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 font-serif text-[12px] italic tracking-[0.08em] text-[var(--muted)]">
        Fig. Hobbies and other things I enjoy.
      </figcaption>
    </figure>
  )
}
