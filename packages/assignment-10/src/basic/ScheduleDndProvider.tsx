import React, { useCallback } from 'react';
import { DndContext, Modifier, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { useScheduleContext } from "./ScheduleContext.tsx";

function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + 120 + 1;
    const minY = containerTop - top + 40 + 1;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;


    return ({
      ...transform,
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
    })
  };
}

const modifiers = [createSnapModifier()];

export default function ScheduleDndProvider({ children }: React.PropsWithChildren) {
  const { getSchedules, updateSchedule } = useScheduleContext();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    const { x, y } = delta;
    const [tableId, index] = (active.id as string).split(':');
    const schedules = getSchedules(tableId);
    const schedule = schedules[Number(index)];
    const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number]);
    const moveDayIndex = Math.floor(x / CellSize.WIDTH);
    const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

    const newSchedule = {
      ...schedule,
      day: DAY_LABELS[(nowDayIndex + moveDayIndex + DAY_LABELS.length) % DAY_LABELS.length],
      range: schedule.range.map(time => 
        Math.max(1, Math.min(24, time + moveTimeIndex))
      ),
    };

    updateSchedule(tableId, Number(index), newSchedule);
  }, [getSchedules, updateSchedule]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
}
