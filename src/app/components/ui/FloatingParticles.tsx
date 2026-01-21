"use client";
import React, { useEffect, useRef, useState } from "react";

export const FloatingParticles = ({ count = 50 }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? Math.floor(count / 2) : count;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.map((particle) => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        if (newX < 0 || newX > canvas.width) particle.vx *= -1;
        if (newY < 0 || newY > canvas.height) particle.vy *= -1;

        newX = Math.max(0, Math.min(canvas.width, newX));
        newY = Math.max(0, Math.min(canvas.height, newY));

        ctx.beginPath();
        ctx.arc(newX, newY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${particle.opacity})`;
        ctx.fill();

        return { ...particle, x: newX, y: newY };
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
