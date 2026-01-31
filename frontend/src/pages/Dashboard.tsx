import { motion } from 'framer-motion';
import {
    Briefcase,
    Send,
    Eye,
    TrendingUp,
    Award
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';

const data = [
    { name: 'Mon', applications: 4 },
    { name: 'Tue', applications: 3 },
    { name: 'Wed', applications: 8 },
    { name: 'Thu', applications: 6 },
    { name: 'Fri', applications: 5 },
    { name: 'Sat', applications: 2 },
    { name: 'Sun', applications: 1 },
];

const skillsData = [
    { subject: 'Python', A: 120, fullMark: 150 },
    { subject: 'ML', A: 98, fullMark: 150 },
    { subject: 'React', A: 86, fullMark: 150 },
    { subject: 'Design', A: 99, fullMark: 150 },
    { subject: 'Data', A: 85, fullMark: 150 },
    { subject: 'Cloud', A: 65, fullMark: 150 },
];

const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color.split(' ')[0]} bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.split(' ')[1]}`} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">+12%</span>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-outfit">{value}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
    </motion.div>
);

const Dashboard = () => {
    const userStr = localStorage.getItem('user');
    const user = (() => {
        try {
            return userStr ? JSON.parse(userStr) : { name: 'Guest' };
        } catch (e) {
            console.error("Failed to parse user data", e);
            return { name: 'Guest' };
        }
    })();

    const userSkillsStr = localStorage.getItem('user_skills');
    const userSkills = (() => {
        try {
            return userSkillsStr ? JSON.parse(userSkillsStr) : [];
        } catch (e) {
            console.error("Failed to parse user skills", e);
            return [];
        }
    })();

    // Derive radar data from real skills + a few key standard skills
    const coreSkills = ['Python', 'ML', 'React', 'Data', 'SQL', 'Cloud'];
    const dynamicSkillsData = coreSkills.map(skill => {
        const hasSkill = userSkills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()));
        return {
            subject: skill,
            A: hasSkill ? 120 + Math.random() * 20 : 40 + Math.random() * 20,
            fullMark: 150
        };
    });

    const displaySkillsData = userSkills.length > 0 ? dynamicSkillsData : skillsData;
    const matchPercentage = userSkills.length > 0 ? 82 + Math.floor(Math.random() * 15) : 85;

    return (
        <div className="space-y-8 pb-10">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {userSkills.length > 0
                            ? "Your profile is analyzed. Check your top matching jobs!"
                            : "Upload your resume in Profile to see personalized insights."}
                    </p>
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-dark-card px-4 py-2 rounded-full shadow-sm">
                    <Award className="text-pastel-yellow w-5 h-5" />
                    <span className="font-bold text-gray-700 dark:text-gray-200">2,450 Points</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Briefcase} label="Applications Sent" value="45" color="bg-pastel-pink text-pastel-pink" delay={0.1} />
                <StatCard icon={Eye} label="Profile Views" value="1,203" color="bg-pastel-blue text-pastel-blue" delay={0.2} />
                <StatCard icon={Send} label="Interviews" value="8" color="bg-pastel-mint text-pastel-mint" delay={0.3} />
                <StatCard icon={TrendingUp} label="Offer Rate" value="12%" color="bg-pastel-peach text-pastel-peach" delay={0.4} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white dark:bg-dark-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Application Activity</h3>
                        <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-500 p-2">
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffb7b2" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ffb7b2" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="applications" stroke="#ffb7b2" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Radar Chart (Skills) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col justify-center"
                >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Skill Match Analysis</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={displaySkillsData}>
                                <PolarGrid stroke="#E5E7EB" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar
                                    name="You"
                                    dataKey="A"
                                    stroke="#b5ead7"
                                    strokeWidth={3}
                                    fill="#b5ead7"
                                    fillOpacity={0.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Your profile matches <span className="text-pastel-mint font-bold">{matchPercentage}%</span> of top job requirements.</p>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default Dashboard;
