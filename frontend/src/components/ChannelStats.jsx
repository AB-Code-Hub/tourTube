import { FiVideo, FiEye, FiUsers, FiHeart, FiClock } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../contexts/ThemeContext";

const ChannelStats = ({ data }) => {
  const { theme } = useTheme();

  const stats = [
    {
      icon: <FiVideo />,
      label: "Total Videos",
      value: data.channelStats.totalVideos,
    },
    {
      icon: <FiEye />,
      label: "Total Views",
      value: data.channelStats.totalViews,
    },
    {
      icon: <FiUsers />,
      label: "Subscribers",
      value: data.channelStats.totalSubscribers,
    },
    {
      icon: <FiHeart />,
      label: "Total Likes",
      value: data.channelStats.totalLikes,
    },
    {
      icon: <FiClock />,
      label: "Total Duration",
      value: `${data.channelStats.totalDuration}s`,
    },
  ];

  return (
    <div
      className={`p-6 rounded-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-100 text-gray-700"
      }`}
    >
      <h2 className="text-xl font-bold mb-6">Channel Analytics</h2>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg flex flex-col items-center ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            <span className="text-2xl mb-2">{stat.icon}</span>
            <div className="text-lg font-bold">{stat.value}</div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div
        className={`p-4 rounded-lg ${
          theme === "dark" ? "bg-gray-700" : "bg-white"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Views in Last 30 Days</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.last30DaysPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                tick={{ fill: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
              />
              <YAxis
                tick={{ fill: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke={theme === "dark" ? "#3B82F6" : "#2563EB"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChannelStats