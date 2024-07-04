import React from 'react';

const STEPS = [
  { title: 'Add a resume pdf', text: 'or create from scartch' },
  { title: 'Preview design', text: 'and make edits' },
  { title: 'Download new resume', text: 'and apply with confidence' },
];

const Steps = () => {
  return (
    <section className="mx-auto mt-8 rounded-2xl bg-sky-50 bg-dot px-8 pb-12 pt-10 lg:mt-12">
      <h1 className="text-center text-3xl font-bold">3 Simple Steps</h1>
      <div className="flex mt-8 justify-center">
        <dl className="flex flex-col gap-y-10 lg:flex-row lg:justify-center lg:gap-x-20">
          {STEPS.map(({ title, text }, idx) => (
            <div key={idx} className="relative self-start pl-14">
              <dt className="text-lg font-bold">
                <div className="bg-primary absolute top-1 left-0 flex h-10 w-10 select-none items-center justify-center rounded-full p-[3.5px] opacity-80">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <div className="text-primary -mt-0.5 text-2xl">{idx + 1}</div>
                  </div>
                </div>
                {title}
              </dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Steps;
