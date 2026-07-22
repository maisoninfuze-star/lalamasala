// Compress the in-use videos with the bundled static ffmpeg (H.264, faststart,
// audio stripped since all playback is muted). Overwrites originals on success.
import { execFileSync } from "node:child_process";
import { statSync, renameSync, rmSync, existsSync } from "node:fs";
import ffmpeg from "ffmpeg-static";

const mb = (p) => (statSync(p).size / 1048576).toFixed(1);

// [file, target width, crf]  — reels are vertical (phone), hero is landscape.
const JOBS = [
  ["public/video/spice-hero.mp4", 1280, 25],
  ["public/video/reel-1.mp4", 720, 26],
  ["public/video/reel-2.mp4", 720, 26],
  ["public/video/reel-3.mp4", 720, 26],
];

for (const [file, width, crf] of JOBS) {
  if (!existsSync(file)) {
    console.log(`skip (missing): ${file}`);
    continue;
  }
  const before = mb(file);
  const tmp = file.replace(/\.mp4$/, ".c.mp4");
  execFileSync(ffmpeg, [
    "-y", "-i", file,
    "-vf", `scale=${width}:-2:flags=lanczos`,
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-crf", String(crf), "-preset", "slow",
    "-an", "-movflags", "+faststart",
    tmp,
  ], { stdio: ["ignore", "ignore", "ignore"] });
  renameSync(tmp, file);
  console.log(`✓ ${file}: ${before}MB → ${mb(file)}MB`);
}

// Remove now-unused videos.
for (const f of ["public/video/hero.mp4", "public/video/spices.mp4"]) {
  if (existsSync(f)) {
    rmSync(f);
    console.log(`removed unused ${f}`);
  }
}
console.log("done.");
