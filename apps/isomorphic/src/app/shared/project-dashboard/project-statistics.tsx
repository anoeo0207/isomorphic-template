'use client';

import { useState } from 'react';
import WidgetCard from '@core/components/cards/widget-card';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import { CustomYAxisTick } from '@core/components/charts/custom-yaxis-tick';
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
} from 'recharts';
import { useMedia } from '@core/hooks/use-media';
import SimpleBar from '@core/ui/simplebar';
import DropdownAction from '@core/components/charts/dropdown-action';
import cn from '@core/utils/class-names';
import { formatNumber } from '@core/utils/format-number';
import {
  PROJECT_STATISTICS_COLORS,
  projectStatisticsDailyData,
  projectStatisticsMonthlyData,
  projectStatisticsTicketStatus,
  projectStatisticsViewOptions,
} from '@/data/project-dashboard';

export default function ProjectStatistics({
  className,
}: {
  className?: string;
}) {
  const [data, setData] = useState(projectStatisticsDailyData);
  const isTab = useMedia('(max-width: 768px)', false);

  function handleChange(viewType: string) {
    if (viewType === 'month') {
      setData(projectStatisticsMonthlyData);
    } else {
      setData(projectStatisticsDailyData);
    }
  }

  return (
    <WidgetCard
      title="Project Statistics"
      className={cn('min-h-[28rem] dark:bg-gray-100/50', className)}
      titleClassName="text-base lg:text-xl font-semibold"
      action={
        <div className="flex items-center gap-5">
          <Legend className="hidden @2xl:flex" />
          <DropdownAction
            className="rounded-md border"
            options={projectStatisticsViewOptions}
            onChange={handleChange}
            dropdownClassName="!z-0"
          />
        </div>
      }
    >
      <Legend className="my-4 flex @md:justify-end @2xl:hidden" />
      <SimpleBar>
        <div className="h-[20rem] w-full pt-6 @lg:pt-8 lg:h-[24rem] 3xl:h-[25rem]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isTab && { minWidth: '1100px' })}
          >
            <ComposedChart
              data={data}
              margin={{
                left: -6,
              }}
              className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12"
            >
              <CartesianGrid
                vertical={false}
                strokeOpacity={0.435}
                strokeDasharray="8 10"
              />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={({ payload, ...rest }) => {
                  const pl = {
                    ...payload,
                    value: formatNumber(Number(payload.value)),
                  };
                  return <CustomYAxisTick payload={pl} {...rest} />;
                }}
              />
              <Tooltip content={<CustomTooltip formattedNumber />} />

              <defs>
                <linearGradient
                  id="completed"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#3562FC" />
                  <stop offset="0.8" stopColor="#3562FC" />
                  <stop offset="1" stopColor="#3562FC" />
                </linearGradient>
              </defs>

              <defs>
                <linearGradient
                  id="inProgress"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#FC9D23" />
                  <stop offset="0.8" stopColor="#FC9D23" />
                  <stop offset="1" stopColor="#FC9D23" />
                </linearGradient>
              </defs>

              <defs>
                <linearGradient
                  id="active"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#81868F" />
                  <stop offset="0.8" stopColor="#81868F" />
                  <stop offset="1" stopColor="#81868F" />
                </linearGradient>
              </defs>

              <Bar
                dataKey="completed"
                fill="url(#completed)"
                stroke={PROJECT_STATISTICS_COLORS[0]}
                barSize={28}
                radius={4}
              />
              <Bar
                type="natural"
                dataKey="inProgress"
                fill="url(#inProgress)"
                stroke={PROJECT_STATISTICS_COLORS[1]}
                barSize={28}
                radius={4}
              />
              <Bar
                type="natural"
                dataKey="active"
                fill="url(#active)"
                stroke={PROJECT_STATISTICS_COLORS[2]}
                barSize={28}
                radius={4}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </SimpleBar>
    </WidgetCard>
  );
}

function Legend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start gap-3 text-xs @3xl:text-sm lg:gap-4',
        className
      )}
    >
      {projectStatisticsTicketStatus.map((item, index) => (
        <div key={item.name} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: PROJECT_STATISTICS_COLORS[index] }}
          />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}