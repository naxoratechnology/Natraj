import React from 'react';

export function PageIntro({ title, description, children }: {title: string;description: string;children?: React.ReactNode;}) {
  return (
    <section className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        {children}
      </div>
    </section>);

}