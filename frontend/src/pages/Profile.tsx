import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, Edit, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Profile = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<null | 'success' | 'error'>(null);
    const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load skills from local storage on mount
    useEffect(() => {
        const savedSkills = localStorage.getItem("user_skills");
        if (savedSkills) {
            try {
                setDetectedSkills(JSON.parse(savedSkills));
            } catch (e) {
                console.error("Failed to parse saved skills", e);
            }
        }
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert("Please login first!");
            window.location.href = '/login';
            return;
        }
        const user = JSON.parse(userStr);

        setIsUploading(true);
        setUploadStatus(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", user.id);

        try {
            const response = await fetch("http://localhost:8000/upload_resume", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            console.log("Resume uploaded:", data);

            // Save ID for matching and skills for display
            localStorage.setItem("current_resume_id", data.id);
            localStorage.setItem("user_skills", JSON.stringify(data.skills_detected));

            setDetectedSkills(data.skills_detected);
            setUploadStatus('success');

        } catch (error) {
            console.error(error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-8">

            {/* Profile Header */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-pastel-pink to-pastel-lavender opacity-30" />

                <div className="relative flex flex-col md:flex-row items-center gap-6 mt-12">
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-card shadow-xl overflow-hidden bg-gray-200">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Alex Johnson</h2>
                        <p className="text-gray-500 dark:text-gray-400">Senior ML Engineer • Open to Work</p>
                        <div className="flex justify-center md:justify-start gap-2 mt-2">
                            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" /> Available
                            </span>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full text-xs font-medium">San Francisco, CA</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="secondary" className="px-3"><Share2 size={18} /></Button>
                        <Button variant="primary">Edit Profile</Button>
                    </div>
                </div>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Resume & Stats */}
                <div className="space-y-8 md:col-span-2">

                    {/* Resume Upload Area */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-lg border-2 border-dashed border-pastel-blue group hover:border-pastel-pink transition-colors cursor-pointer text-center relative"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-pastel-pink border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Analyzing with AI...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-pastel-blue/20 text-pastel-blue group-hover:bg-pastel-pink/20 group-hover:text-pastel-pink rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                    {uploadStatus === 'success' ? <CheckCircle size={32} /> : <Upload size={32} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                    {uploadStatus === 'success' ? 'Resume Parsed Successfully! ✨' : 'Upload your Resume'}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    {uploadStatus === 'success' ? 'We have extracted your skills. Check matches!' : 'Drag & drop your PDF or DOCX here to let our AI analyze your profile.'}
                                </p>
                                <div className="flex justify-center">
                                    <Button variant="ghost" className="bg-gray-100 dark:bg-gray-800 pointer-events-none">
                                        {uploadStatus === 'success' ? 'Upload New' : 'Browse Files'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Parsed Skills */}
                    <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Verified Skills</h3>
                            <Button variant="ghost" size="sm"><Edit size={16} /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {detectedSkills.length > 0 ? (
                                detectedSkills.map((skill, i) => (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={skill}
                                        className="px-4 py-2 bg-pastel-lavender/30 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-pastel-pink/30 transition-colors cursor-default"
                                    >
                                        {skill}
                                    </motion.span>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm italic">Upload a resume to detect skills...</p>
                            )}
                            <button className="px-4 py-2 border border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors text-sm">
                                + Add Skill
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Column: Achievements */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Achievements</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">🏆</div>
                                <div>
                                    <h4 className="font-bold text-sm">Early Adopter</h4>
                                    <p className="text-xs text-gray-500">Joined in Alpha</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-pastel-pink/30 text-pastel-pink flex items-center justify-center">🔥</div>
                                <div>
                                    <h4 className="font-bold text-sm">On Fire!</h4>
                                    <p className="text-xs text-gray-500">7 Day Streak</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-blue rounded-3xl p-6 shadow-lg text-white">
                        <h3 className="font-bold text-lg mb-2">Upgrade to Pro ✨</h3>
                        <p className="text-sm opacity-90 mb-4">Get unlimited resume parses and AI cover letters.</p>
                        <Button className="w-full bg-white text-gray-800 hover:bg-gray-50">View Plans</Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
