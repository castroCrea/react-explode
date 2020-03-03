import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  createRef
} from "react";
import gsap, { Power1, Power4, Expo } from "gsap";
import Wave2, { length as WaveLength } from "../Icons/Wave2";
import Circle from "../Icons/Circle";

let TIME_LINE;
const unicornColors = [
  "#5B41C1",
  "#5893E0",
  "#43C2C2",
  "#58E55C",
  "#FCF04E",
  "#FFA500",
  "#F25A5F",
  "#FF6A80"
];

const LINES_LENGTH = 8;
const CIRCLES = [
  { pos: [50, 50], size: 50, delay: 0.7 },
  { pos: [68, 15], size: 10, delay: 0.9 },
  { pos: [65, 20], size: 7, delay: 1 },
  { pos: [32, 84], size: 10, delay: 0.9 },
  { pos: [28, 80], size: 7, delay: 1 }
];
const CIRCLES_LENGTH = CIRCLES.length;
const LINE_STROKE_WIDTH = 2;
const CIRCLE_STROKE_WIDTH = 2;

export default function Explosion19({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  onComplete,
  onStart,
  onRepeat
}) {
  const linesRefs = useRef([...Array(LINES_LENGTH)].map(() => createRef()));
  const circlesRefs = useRef(
    [...Array(CIRCLES_LENGTH)].map(() => ({
      svg: createRef(),
      shape: createRef()
    }))
  );

  const [prevSize, setPrevSize] = useState(400);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const lineStrokeWidth = (LINE_STROKE_WIDTH * 100) / prevSize;

  const animateLines = useCallback(() => {
    const timelines = [];

    linesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: (i % 4) * 0.03 });

      timeline.set(ref.current, {
        attr: {
          "stroke-dasharray": `0 ${WaveLength}`,
          "stroke-dashoffset": 0,
          "stroke-width": 0
        }
      });

      timeline.to(ref.current, 0.2, {
        attr: { "stroke-width": lineStrokeWidth }
      });

      timeline.to(
        ref.current,
        {
          keyframes: [
            {
              attr: {
                "stroke-dasharray": `50 ${WaveLength - 50}`,
                "stroke-dashoffset": -20
              },
              duration: 0.6
            },
            {
              attr: {
                "stroke-dasharray": `0 ${WaveLength}`,
                "stroke-dashoffset": WaveLength * -1
              },
              duration: 0.8
            }
          ],
          ease: Power4.easeInOut
        },
        "-=0.2"
      );

      timeline.to(
        ref.current,
        0.3,
        {
          attr: { "stroke-width": 0 },
          ease: Power4.easeInOut
        },
        "-=0.5"
      );

      timelines.push(timeline);
    });

    return timelines;
  }, [lineStrokeWidth]);
  const animateCircles = useCallback(() => {
    const timelines = [];
    const strokeWidth = (prevSize * CIRCLE_STROKE_WIDTH) / 100;

    circlesRefs.current.forEach(({ svg, shape }, i) => {
      const timeline = gsap.timeline({ delay: CIRCLES[i].delay });

      timeline.set(shape.current, { attr: { "stroke-width": 15, r: 0 } });
      timeline.set(svg.current, { opacity: 1 });
      timeline.fromTo(
        shape.current,
        0.5,
        { attr: { r: 0, "stroke-width": 15 } },
        {
          attr: { r: "45%", "stroke-width": strokeWidth },
          ease: Power4.easeOut
        }
      );
      timeline.to(
        shape.current,
        0.5,
        { attr: { "stroke-width": 0 }, ease: Power4.easeOut },
        "-=0.5"
      );
      timeline.fromTo(
        svg.current,
        0.4,
        { opacity: 1 },
        { opacity: 0 },
        "-=0.4"
      );

      timelines.push(timeline);
    });

    return timelines;
  }, [prevSize]);

  const explode = useCallback(() => {
    const linesTimelines = animateLines();
    const circleTimeline = animateCircles();

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(linesTimelines, 0);
    TIME_LINE.add(circleTimeline, 0);
  }, [
    animateCircles,
    animateLines,
    onComplete,
    onStart,
    onRepeat,
    prevRepeat,
    prevDelay,
    prevRepeatDelay
  ]);

  useEffect(() => {
    if (TIME_LINE) TIME_LINE.kill();
    explode();
  }, [explode]);

  useEffect(() => {
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  return (
    <div style={{ width: prevSize, height: prevSize, ...style }}>
      {linesRefs.current.map((ref, i) => (
        <Wave2
          key={i}
          shapeRef={ref}
          width="68%"
          height="50%"
          strokeWidth={lineStrokeWidth}
          dasharray={`0 ${WaveLength}`}
          color={unicornColors[i]}
          style={{
            position: "absolute",
            transform: `
                translate(-50%, -50%)
                rotate(${Math.floor((i * 2) / LINES_LENGTH) * 180}deg)
            `,
            top: `${50 +
              (Math.floor((i * 2) / (LINES_LENGTH - 1)) ? -1 : 1) * 20.5 -
              ((LINES_LENGTH - 1) * 2.5) / 2 +
              i * 2.5}%`,
            left: `${50 +
              Math.cos(Math.PI * Math.floor((i * 2) / LINES_LENGTH)) * 15}%`
          }}
        />
      ))}
      {CIRCLES.map(({ pos, size }, i) => (
        <Circle
          key={i}
          shapeRef={circlesRefs.current[i].shape}
          ref={circlesRefs.current[i].svg}
          width={`${size}%`}
          height={`${size}%`}
          strokeWidth={15}
          radius={0}
          color={unicornColors[unicornColors.length - 1 - i]}
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            left: `${pos[0]}%`,
            top: `${pos[1]}%`,
            opacity: 0
          }}
        />
      ))}
    </div>
  );
}
