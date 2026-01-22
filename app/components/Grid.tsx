"use client";

import React, { useEffect, useState } from "react";


type Coord = { x: number; y: number };

type Product = {
  name: string;
  position: Coord;
};

type GridProps = {
  size?: number;
  products: Product[];
  blocked?: Coord[];
};

export default function Grid({ size = 5, products, blocked = [] }: GridProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [path, setPath] = useState<Coord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatedPath, setAnimatedPath] = useState<Coord[]>([{ x: 0, y: 0 }]);
  const [collected, setCollected] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<Product[]>(products);

  const start: Coord = { x: 0, y: 0 };
  const exit: Coord = { x: size - 1, y: size - 1 };

  // ---------------- GRID INIT ----------------
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
    computePath(products);
  }, []);

  // ---------------- BFS ----------------
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

  // ---------------- PATH COMPUTATION ----------------
  const computePath = (list: Product[]) => {
    let fullPath: Coord[] = [];
    let current = animatedPath[animatedPath.length - 1] || start;

    for (const p of list) {
      const segment = bfs(current, p.position);

      if (segment.length > 0) {
        if (fullPath.length > 0) segment.shift();
        fullPath = [...fullPath, ...segment];
        current = p.position;
      }
    }

    const toExit = bfs(current, exit);
    if (toExit.length > 0) {
      toExit.shift();
      fullPath = [...fullPath, ...toExit];
    }

    setPath(fullPath);
    setCurrentIndex(0);
  };

  const currentCoord = animatedPath[animatedPath.length - 1];

  const currentProduct = remaining.find(
    p =>
      p.position.x === currentCoord.x &&
      p.position.y === currentCoord.y
  );

  // ---------------- MOVE STEP ----------------
  const handleNextStep = () => {
    if (currentIndex + 1 >= path.length) return;

    const next = path[currentIndex + 1];
    setAnimatedPath(p => [...p, next]);
    setCurrentIndex(prev => prev + 1);
  };

  // ---------------- COLLECT ----------------
  const handleCollect = () => {
    if (!currentProduct) return;

    const newCollected = [...collected, currentProduct.name];
    const newRemaining = remaining.filter(
      p => p.name !== currentProduct.name
    );

    setCollected(newCollected);
    setRemaining(newRemaining);

    computePath(newRemaining);
  };

  // ---------------- DIRECTIONS ----------------
  const directions: string[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];

    if (b.x > a.x) directions.push("Move Right");
    else if (b.x < a.x) directions.push("Move Left");
    else if (b.y > a.y) directions.push("Move Down");
    else if (b.y < a.y) directions.push("Move Up");

    const product = remaining.find(
      p => p.position.x === b.x && p.position.y === b.y
    );

    if (product) directions.push(`Pick: ${product.name}`);
  }

  const currentStep =
    currentIndex < directions.length
      ? directions[currentIndex]
      : "Navigation complete";

  // ---------------- UI ----------------
  return (
    <div className="flex gap-10">

      {/* GRID */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, 60px)` }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isCurrent =
              currentCoord.x === x &&
              currentCoord.y === y;

            const productHere = products.find(
              p => p.position.x === x && p.position.y === y
            );

            const isCollected =
              productHere && collected.includes(productHere.name);

            return (
              <div
                key={`${x}-${y}`}
                className={`relative w-14 h-14 flex items-center justify-center border rounded-md
                  ${cell === "start" ? "bg-green-500" : ""}
                  ${cell === "exit" ? "bg-red-500" : ""}
                  ${cell === "blocked" ? "bg-gray-700" : ""}
                  ${productHere && !isCollected ? "bg-blue-500" : ""}
                  ${isCollected ? "bg-green-600" : ""}
                `}
              >
                {productHere?.name[0]}

                {isCurrent && (
                  <div className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-lg" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SIDE PANEL */}
      <div className="w-80 bg-black/60 border border-gray-700 rounded-xl p-5 text-white">

        {/* Pickup */}
        {currentProduct && (
          <div className="mb-4 p-4 bg-blue-900/40 border border-blue-500 rounded-lg text-center">
            <div className="mb-2 font-semibold">
              Reached: {currentProduct.name}
            </div>

            <button
              onClick={handleCollect}
              className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Pick Up Item ✅
            </button>
          </div>
        )}

        {/* Move Button */}
        {!currentProduct && currentIndex < path.length - 1 && (
          <button
            onClick={handleNextStep}
            className="w-full mb-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Done Step ➡️
          </button>
        )}

        {/* Collected */}
        <div className="mb-4">
          <h3 className="text-green-400 font-semibold mb-2">Collected</h3>
          {collected.map((c, i) => (
            <div key={i} className="text-sm">✔ {c}</div>
          ))}
        </div>

        {/* Remaining */}
        <div className="mb-4">
          <h3 className="text-yellow-400 font-semibold mb-2">Remaining</h3>
          {remaining.map((r, i) => (
            <div key={i} className="text-sm">• {r.name}</div>
          ))}
        </div>

        {/* Instruction */}
        <div className="p-3 bg-gray-900 rounded-lg">
          <div className="text-blue-400 font-semibold">Now:</div>
          <div className="text-lg">{currentStep}</div>
        </div>
      </div>
    </div>
  );
}
