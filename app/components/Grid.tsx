"use client";

import React, { useEffect, useState } from "react";

type Coord = { x: number; y: number };

type GridProps = {
  size?: number;
  products: { name: string; position: Coord }[];
  blocked?: Coord[];
};

export default function Grid({ size = 5, products, blocked = [] }: GridProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [path, setPath] = useState<Coord[]>([]);
  const [animatedPath, setAnimatedPath] = useState<Coord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);

  const start: Coord = { x: 0, y: 0 };
  const exit: Coord = { x: size - 1, y: size - 1 };

  // Initialize grid
  useEffect(() => {
    const g: string[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );

    blocked.forEach(b => {
      if (g[b.y] && g[b.y][b.x] !== undefined) {
        g[b.y][b.x] = "blocked";
      }
    });

    products.forEach(p => {
      if (g[p.position.y] && g[p.position.y][p.position.x] !== undefined) {
        g[p.position.y][p.position.x] = "product";
      }
    });

    g[start.y][start.x] = "start";
    g[exit.y][exit.x] = "exit";

    setGrid(g);
    computePath();
  }, [products, blocked]);

  // 🔥 BFS shortest path
  const bfs = (start: Coord, goal: Coord) => {
    const queue: Coord[] = [start];
    const visited = new Set<string>();
    const parent = new Map<string, Coord | null>();

    const key = (c: Coord) => `${c.x},${c.y}`;

    visited.add(key(start));
    parent.set(key(start), null);

    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    const isBlocked = (c: Coord) =>
      blocked.some(b => b.x === c.x && b.y === c.y);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.x === goal.x && current.y === goal.y) {
        const path: Coord[] = [];
        let cur: Coord | null = current;

        while (cur) {
          path.push(cur);
          cur = parent.get(key(cur)) || null;
        }

        return path.reverse();
      }

      for (const d of dirs) {
        const next = { x: current.x + d.x, y: current.y + d.y };

        if (
          next.x < 0 ||
          next.y < 0 ||
          next.x >= size ||
          next.y >= size
        )
          continue;

        if (isBlocked(next)) continue;

        const k = key(next);
        if (visited.has(k)) continue;

        visited.add(k);
        parent.set(k, current);
        queue.push(next);
      }
    }

    return [];
  };

  // 🔥 FULL ROUTE THROUGH ALL PRODUCTS THEN EXIT
  const computePath = () => {
    let fullPath: Coord[] = [];
    let current = start;

    for (const p of products) {
      const segment = bfs(current, p.position);

      if (segment.length > 0) {
        if (fullPath.length > 0) segment.shift(); // avoid duplicate
        fullPath = [...fullPath, ...segment];
        current = p.position;
      }
    }

    // Go to exit
    const toExit = bfs(current, exit);
    if (toExit.length > 0) {
      toExit.shift();
      fullPath = [...fullPath, ...toExit];
    }

    setPath(fullPath);
  };

  // 🔥 Animate dot movement
  useEffect(() => {
    if (path.length === 0) return;

    setAnimatedPath([start]);
    setCurrentIndex(0);

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev + 1 >= path.length) {
          clearInterval(interval);
          return prev;
        }

        setAnimatedPath(p => [...p, path[prev + 1]]);
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [path]);

  const currentCoord = animatedPath[animatedPath.length - 1];

  const currentProduct =
    currentCoord &&
    products.find(
      p =>
        p.position.x === currentCoord.x &&
        p.position.y === currentCoord.y
    )?.name;

    // 🔥 Generate step instructions from path
const directions: string[] = [];

for (let i = 0; i < path.length - 1; i++) {
  const a = path[i];
  const b = path[i + 1];

  let move = "";

  if (b.x > a.x) move = "Move Right";
  else if (b.x < a.x) move = "Move Left";
  else if (b.y > a.y) move = "Move Down";
  else if (b.y < a.y) move = "Move Up";

  directions.push(move);

  // Check if next cell is a product
  const product = products.find(
    p => p.position.x === b.x && p.position.y === b.y
  );

  if (product) {
    directions.push(`Pick: ${product.name}`);
  }
}

directions.unshift("Start at Entrance");
directions.push("Exit Store");

// Distance + time
const totalSteps = path.length;
const estimatedTime = Math.round(totalSteps * 1.2); // seconds

// Current live instruction
const currentStep =
  currentIndex < directions.length
    ? directions[currentIndex]
    : "Navigation complete";

const nextStep =
  currentIndex + 1 < directions.length
    ? directions[currentIndex + 1]
    : null;


  return (
    <div className="flex flex-col items-center">
      {/* GRID */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, 60px)` }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isVisited = animatedPath.some(
              p => p.x === x && p.y === y
            );

            const isCurrent =
              currentCoord &&
              currentCoord.x === x &&
              currentCoord.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className={`relative w-14 h-14 flex items-center justify-center border rounded-md transition-all
                  ${cell === "start" ? "bg-green-500 text-white font-bold" : ""}
                  ${cell === "exit" ? "bg-red-500 text-white font-bold" : ""}
                  ${cell === "product" ? "bg-blue-500 text-white font-bold" : ""}
                  ${cell === "blocked" ? "bg-gray-700" : ""}
                  ${
                    isVisited &&
                    cell !== "start" &&
                    cell !== "exit" &&
                    cell !== "product"
                      ? "bg-yellow-200"
                      : ""
                  }
                `}
              >
                {/* Product letter */}
                {cell === "product" &&
                  products.find(
                    p => p.position.x === x && p.position.y === y
                  )?.name[0]}

                {/* MOVING DOT */}
                {isCurrent && (
                  <div className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* STATUS */}
      {/* INFO PANEL */}
<div className="mt-6 w-full max-w-md bg-black/60 border border-gray-700 rounded-xl p-5 text-white">

  {/* Distance & Time */}
  <div className="flex justify-between text-sm text-gray-300 mb-3">
    <span>Distance: <b>{totalSteps}</b> steps</span>
    <span>Time: ~<b>{estimatedTime}</b> sec</span>
  </div>

  {/* Live Instruction */}
  <div className="mb-4 p-3 bg-gray-900 rounded-lg">
    <div className="text-blue-400 font-semibold">Now:</div>
    <div className="text-lg">{currentStep}</div>

    {nextStep && (
      <div className="text-sm text-gray-400 mt-1">
        Next: {nextStep}
      </div>
    )}
  </div>

  {/* Full Directions */}
  <div className="max-h-40 overflow-y-auto space-y-2 text-sm">
    {directions.map((step, i) => (
      <div
        key={i}
        className={`flex items-center gap-2 p-2 rounded
          ${i === currentIndex ? "bg-blue-600/40 text-white" : "text-gray-300"}
        `}
      >
        <span className="text-gray-500">{i + 1}.</span>
        <span>{step}</span>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
