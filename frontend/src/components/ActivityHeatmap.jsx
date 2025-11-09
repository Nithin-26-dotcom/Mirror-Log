import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function ActivityHeatmap({ logs = [] }) {
    // Filter logs to only include last year's activity
    const filteredLogs = useMemo(() => {
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        oneYearAgo.setHours(0, 0, 0, 0);
        
        return logs.filter((log) => {
            if (!log.createdAt) return false;
            const logDate = new Date(log.createdAt);
            return logDate >= oneYearAgo;
        });
    }, [logs]);

    // Process logs to count activity per day
    const activityData = useMemo(() => {
        const activityMap = new Map();
        
        filteredLogs.forEach((log) => {
            if (!log.createdAt) return;
            const date = new Date(log.createdAt);
            const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
            
            activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
        });
        
        return activityMap;
    }, [filteredLogs]);

    // Generate last 365 days (or last year)
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Start from 365 days ago
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const count = activityData.get(dateStr) || 0;
            
            result.push({
                date: date,
                dateStr: dateStr,
                count: count,
            });
        }
        
        return result;
    }, [activityData]);

    // Get intensity level (0-4) based on count
    const getIntensity = (count) => {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count >= 2 && count <= 3) return 2;
        if (count >= 4 && count <= 5) return 3;
        return 4;
    };

    // Get color based on intensity
    const getColor = (intensity) => {
        const colors = [
            "bg-gray-100 dark:bg-gray-800", // 0 - no activity
            "bg-green-200", // 1 - low
            "bg-green-400", // 2 - medium
            "bg-green-500", // 3 - high
            "bg-green-600", // 4 - very high
        ];
        return colors[intensity] || colors[0];
    };

    // Group days by weeks (7 days per week, starting from the first day)
    const weeks = useMemo(() => {
        const weeksArray = [];
        const daysPerWeek = 7;
        
        // Find the first day's day of week (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = days[0]?.date.getDay() || 0;
        
        // Create a flat array with proper week grouping
        for (let i = 0; i < days.length; i += daysPerWeek) {
            const week = days.slice(i, i + daysPerWeek);
            weeksArray.push(week);
        }
        
        return weeksArray;
    }, [days]);

    // Calculate total activity
    const totalActivity = useMemo(() => {
        return Array.from(activityData.values()).reduce((sum, count) => sum + count, 0);
    }, [activityData]);

    // Get day name abbreviation
    const getDayName = (date) => {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return dayNames[date.getDay()];
    };

    // Get month name
    const getMonthName = (date) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[date.getMonth()];
    };

    // Get month labels for x-axis - show first occurrence of each month
    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        let lastWeekIndex = -1;
        
        days.forEach((day, index) => {
            const month = day.date.getMonth();
            const weekIndex = Math.floor(index / 7);
            
            // Show label on first day of month, but only if it's in a different week than last label
            if (month !== lastMonth && (index === 0 || weekIndex !== lastWeekIndex)) {
                labels.push({
                    index: index,
                    weekIndex: weekIndex,
                    month: getMonthName(day.date),
                });
                lastMonth = month;
                lastWeekIndex = weekIndex;
            }
        });
        
        return labels;
    }, [days]);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Activity Heatmap</h3>
                        <p className="text-sm text-gray-500">
                            {totalActivity} {totalActivity === 1 ? "contribution" : "contributions"} in the last year
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="inline-flex">
                    {/* Day labels - Left side */}
                    <div className="flex flex-col gap-1 mr-2 pt-6">
                        {[1, 3, 5].map((dayIdx) => (
                            <div key={dayIdx} className="h-3 text-xs text-gray-500 w-8 text-right">
                                {dayIdx === 1 ? "Mon" : dayIdx === 3 ? "Wed" : "Fri"}
                            </div>
                        ))}
                    </div>

                    {/* Heatmap grid with month labels */}
                    <div className="flex flex-col">
                        {/* Month labels - Top */}
                        <div className="flex gap-1 mb-2 h-6">
                            {monthLabels.map((label, idx) => {
                                const prevIndex = monthLabels[idx - 1]?.index || 0;
                                const weekOffset = Math.floor((label.index - prevIndex) / 7);
                                return (
                                    <span
                                        key={idx}
                                        className="text-xs text-gray-500 whitespace-nowrap"
                                        style={{
                                            marginLeft: idx === 0 ? "0" : `${weekOffset * 13}px`,
                                        }}
                                    >
                                        {label.month}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Heatmap grid - Weeks as columns, days as rows */}
                        <div className="flex gap-1">
                            {weeks.map((week, weekIdx) => (
                                <div key={weekIdx} className="flex flex-col gap-1">
                                    {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                                        const day = week[dayIdx];
                                        if (!day) {
                                            return <div key={dayIdx} className="w-3 h-3" />;
                                        }
                                        const intensity = getIntensity(day.count);
                                        const color = getColor(intensity);
                                        const tooltipText = `${day.date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}: ${day.count} ${day.count === 1 ? "log" : "logs"}`;

                                        return (
                                            <motion.div
                                                key={`${weekIdx}-${dayIdx}`}
                                                className={`w-3 h-3 ${color} rounded-sm cursor-pointer hover:ring-2 hover:ring-gray-400 hover:ring-offset-1 transition-all border border-gray-200/50`}
                                                title={tooltipText}
                                                whileHover={{ scale: 1.15, zIndex: 10 }}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.15 }}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
}

