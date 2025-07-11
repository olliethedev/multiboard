import { AnimatedContainer } from "@/components/animated-container";
import {
  GitBranch,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Layers,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Task Management",
    icon: CheckCircle,
    description:
      "Create, organize, and track tasks with intuitive kanban boards. Drag and drop cards between columns to visualize your workflow.",
  },
  {
    title: "Team Collaboration",
    icon: Users,
    description:
      "Work together seamlessly with real-time updates, comments, and notifications. Keep your team aligned and productive.",
  },
  {
    title: "Lightning Fast",
    icon: Zap,
    description:
      "Built for speed with modern web technologies. Experience instant updates and smooth interactions across all devices.",
  },
  {
    title: "Secure & Private",
    icon: Shield,
    description:
      "Your data is protected with enterprise-grade security. Self-host or use our secure cloud infrastructure.",
  },
  {
    title: "Flexible Boards",
    icon: Layers,
    description:
      "Customize your boards with unlimited columns, labels, and workflows. Adapt to any project methodology.",
  },
  {
    title: "Open Source",
    icon: GitBranch,
    description:
      "Fully open source and transparent. Contribute to the project or deploy your own instance with complete control.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
        <AnimatedContainer className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
            Everything You Need for Team Success
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            Powerful features designed to enhance productivity and
            collaboration.
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          delay={0.4}
          className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
}

type FeatureType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

type FeatureCardProps = React.ComponentProps<"div"> & {
  feature: FeatureType;
};

function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
  const [pattern, setPattern] = React.useState<number[][]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setPattern(genRandomPattern());
  }, []);

  return (
    <div className={cn("relative overflow-hidden p-6", className)} {...props}>
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="from-foreground/5 to-foreground/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={isClient ? pattern : []}
            className="fill-foreground/5 stroke-foreground/25 absolute inset-0 h-full w-full mix-blend-overlay"
          />
        </div>
      </div>
      <feature.icon
        className="text-foreground/75 size-6"
        strokeWidth={1}
        aria-hidden
      />
      <h3 className="mt-10 text-sm md:text-base">{feature.title}</h3>
      <p className="text-muted-foreground relative z-20 mt-2 text-xs font-light">
        {feature.description}
      </p>
    </div>
  );
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<"svg"> & {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
}) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect
              strokeWidth="0"
              key={index}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genRandomPattern(length?: number): number[][] {
  length = length ?? 5;
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7,
    Math.floor(Math.random() * 6) + 1,
  ]);
}
