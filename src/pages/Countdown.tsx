import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Clock, Heart, Sparkles, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import { useCouple } from '../context/CoupleContext';

export const Countdown: React.FC = () => {
  const { settings, timeTogether, daysTogether, updateSettings } = useCouple();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newDate, setNewDate] = useState(settings.relationship_start_date);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fda4af', '#f43f5e', '#e11d48']
    });
  };

  const handleSaveDate = async () => {
    await updateSettings({
      ...settings,
      relationship_start_date: newDate
    });
    setIsEditingDate(false);
    triggerConfetti();
  };

  // Milestone targets
  const milestones = [
    { targetDays: 100, label: '相恋 100 天' },
    { targetDays: 365, label: '一周年纪念日' },
    { targetDays: 500, label: '相恋 500 天' },
    { targetDays: 730, label: '两周年纪念日' },
    { targetDays: 1000, label: '相恋 1000 天' },
    { targetDays: 1825, label: '五周年纪念日' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>倒计时</span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-800">
            恋爱倒计时
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            细数两颗心交织以来的每一秒。
          </p>
        </div>

        <button
          onClick={triggerConfetti}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-200 hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>庆祝我们的爱 🎉</span>
        </button>
      </div>

      {/* Main Countdown Board */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-rose-200/80 shadow-xl text-center space-y-8 relative overflow-hidden">
        
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 flex items-center justify-center space-x-1">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>始于 {settings.relationship_start_date}</span>
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </span>
          <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-slate-800">
            {settings.partner1_name} & {settings.partner2_name}
          </h2>
          <p className="text-sm font-medium text-slate-600">
            在属于我们的宇宙里共度了 {daysTogether.toLocaleString()} 天
          </p>
        </div>

        {/* Real-time ticker cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 p-4 rounded-2xl shadow-sm border border-rose-100">
            <span className="block font-serif font-extrabold text-3xl sm:text-4xl text-rose-600">{timeTogether.years}</span>
            <span className="text-xs text-slate-500 font-semibold uppercase mt-1 block">年</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 p-4 rounded-2xl shadow-sm border border-rose-100">
            <span className="block font-serif font-extrabold text-3xl sm:text-4xl text-rose-600">{timeTogether.months}</span>
            <span className="text-xs text-slate-500 font-semibold uppercase mt-1 block">月</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 p-4 rounded-2xl shadow-sm border border-rose-100">
            <span className="block font-serif font-extrabold text-3xl sm:text-4xl text-rose-600">{timeTogether.days}</span>
            <span className="text-xs text-slate-500 font-semibold uppercase mt-1 block">天</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 p-4 rounded-2xl shadow-sm border border-rose-100">
            <span className="block font-serif font-extrabold text-3xl sm:text-4xl text-rose-600">{timeTogether.hours}</span>
            <span className="text-xs text-slate-500 font-semibold uppercase mt-1 block">时</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 p-4 rounded-2xl shadow-sm border border-rose-100">
            <span className="block font-serif font-extrabold text-3xl sm:text-4xl text-rose-600">{timeTogether.minutes}</span>
            <span className="text-xs text-slate-500 font-semibold uppercase mt-1 block">分</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 p-4 rounded-2xl shadow-sm border border-rose-100">
            <span className="block font-serif font-extrabold text-3xl sm:text-4xl text-rose-600">{timeTogether.seconds}</span>
            <span className="text-xs text-slate-500 font-semibold uppercase mt-1 block">秒</span>
          </motion.div>
        </div>

        {/* Change Start Date Button */}
        <div className="pt-2">
          {isEditingDate ? (
            <div className="flex items-center justify-center space-x-2 max-w-xs mx-auto">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs bg-white outline-none"
              />
              <button
                onClick={handleSaveDate}
                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-sm hover:bg-rose-600"
              >
                保存
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDate(true)}
              className="text-xs text-rose-500 font-semibold underline hover:text-rose-700"
            >
              修改相恋开始日期
            </button>
          )}
        </div>

      </div>

      {/* Love Milestones Grid */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 space-y-6">
        <h3 className="font-serif font-bold text-xl text-slate-800 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>恋爱里程碑追踪</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((m) => {
            const isPassed = daysTogether >= m.targetDays;
            const remaining = Math.max(0, m.targetDays - daysTogether);
            const progress = Math.min(100, Math.floor((daysTogether / m.targetDays) * 100));

            return (
              <div
                key={m.targetDays}
                className={`p-5 rounded-2xl border transition-all ${
                  isPassed
                    ? 'bg-rose-50/80 border-rose-200 shadow-sm'
                    : 'bg-white/60 border-slate-100 opacity-90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-sm text-slate-800">{m.label}</span>
                  {isPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <span className="text-[10px] font-bold text-rose-500 uppercase">还剩 {remaining} 天</span>
                  )}
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-gradient-to-r from-rose-400 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  {isPassed ? '已达成并庆祝 💕' : `已完成 ${progress}%`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
