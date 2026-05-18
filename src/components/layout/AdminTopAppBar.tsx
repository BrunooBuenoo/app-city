"use client";

import React from "react";

export default function AdminTopAppBar() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md border-b border-outline-variant dark:border-outline shadow-sm flex justify-between items-center h-16 px-gutter ml-64">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md group-focus-within:text-primary">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            placeholder="Pesquisar..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-gutter">
        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <div className="h-8 w-px bg-outline-variant"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-label-lg text-label-lg text-on-surface leading-none">
              Admin
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Gestor
            </p>
          </div>
          <img
            alt="Administrator Avatar"
            className="w-10 h-10 rounded-full border border-outline-variant object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4wXddsjeB8-KtROcVD4GsDcIolXY4hcjWUWjX-e9zvWSRZXJxfl6Wmyzd2QvkZ0cVxuKMIhqvaMWz-xRzMxaPVCpw0lbCNUfF6jqWoKgZQ1Z2YjnRJKfHmL4nJGGV1uFmBWUP1v37CAFnNBhDCoLMAReTbJz0Ey3_6q9mKiejbypuB_1EZuNUwcNUR0xVxu0TDM_df4IMZa5x40K7l0cMInlIMkTU38AYcD3K_Th5WVQVQKOl9Rf-ODNC_guUvNTbRI-EKpBzilOv"
          />
        </div>
      </div>
    </header>
  );
}
