import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  Heart,
  Image,
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { MediaUploader } from '../components/MediaUploader';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useCouple();
  const [formState, setFormState] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>设置</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-800">
          设置与配置
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          自定义情侣昵称、纪念日、背景照片以及标题设置。
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 rounded-3xl border border-rose-200/80 shadow-md space-y-6">
        
        <h3 className="font-serif font-bold text-xl text-slate-800 border-b border-rose-100 pb-3 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>情侣身份与档案</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">伴侣 1 昵称</label>
            <input
              type="text"
              required
              value={formState.partner1_name}
              onChange={(e) => setFormState({ ...formState, partner1_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-xs sm:text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">伴侣 2 昵称</label>
            <input
              type="text"
              required
              value={formState.partner2_name}
              onChange={(e) => setFormState({ ...formState, partner2_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-xs sm:text-sm outline-none"
            />
          </div>
        </div>

        {/* Avatars & Card Background Cover Photo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">伴侣 1 头像</label>
            <MediaUploader
              bucket="photos"
              label="上传伴侣 1 头像"
              accept="image/*"
              onUploadSuccess={(url) => setFormState({ ...formState, partner1_avatar: url })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">伴侣 2 头像</label>
            <MediaUploader
              bucket="photos"
              label="上传伴侣 2 头像"
              accept="image/*"
              onUploadSuccess={(url) => setFormState({ ...formState, partner2_avatar: url })}
            />
          </div>
        </div>

        {/* Polaroid Showcase Background / Cover Photo CRUD */}
        <div className="space-y-3 pt-4 border-t border-rose-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Image className="w-4 h-4 text-rose-500" />
              <span>背景照片</span>
            </label>
            {formState.cover_photo && (
              <button
                type="button"
                onClick={() => setFormState({ ...formState, cover_photo: '' })}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 hover:underline transition-colors"
              >
                删除背景照片
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500">
            这张照片将作为首页卡片的背景图进行展示。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="sm:col-span-2 space-y-3">
              <MediaUploader
                bucket="photos"
                label="上传背景照片"
                accept="image/*"
                onUploadSuccess={(url) => setFormState({ ...formState, cover_photo: url })}
              />
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">或者输入图片链接 (URL)：</span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formState.cover_photo || ''}
                  onChange={(e) => setFormState({ ...formState, cover_photo: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-rose-200 text-xs outline-none bg-white"
                />
              </div>
            </div>

            {/* Preview Box */}
            <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">背景预览</span>
              {formState.cover_photo ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm border border-rose-200 group">
                  <img
                    src={formState.cover_photo}
                    alt="Background Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, cover_photo: '' })}
                      className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-rose-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-rose-200 flex flex-col items-center justify-center text-rose-300 p-2">
                  <Image className="w-8 h-8 mb-1" />
                  <span className="text-[10px] text-slate-400">暂无背景照片</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Relationship Date & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">恋爱纪念日 / 开始日期</label>
            <input
              type="date"
              required
              value={formState.relationship_start_date}
              onChange={(e) => setFormState({ ...formState, relationship_start_date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-xs sm:text-sm outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">动态漂浮粒子特效</label>
            <select
              value={formState.particle_type}
              onChange={(e) => setFormState({ ...formState, particle_type: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-xs sm:text-sm outline-none bg-white"
            >
              <option value="hearts">💖 漂浮爱心</option>
              <option value="sakura">🌸 樱花花瓣</option>
              <option value="stars">✨ 闪耀星星</option>
              <option value="sparkles">💫 闪烁光芒</option>
              <option value="bubbles">🫧 浪漫气泡</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">首页主标题</label>
          <input
            type="text"
            value={formState.hero_title}
            onChange={(e) => setFormState({ ...formState, hero_title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-xs sm:text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">首页副标题</label>
          <textarea
            rows={2}
            value={formState.hero_subtitle}
            onChange={(e) => setFormState({ ...formState, hero_subtitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-xs sm:text-sm outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-rose-100">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>设置保存成功！</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-200 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>保存设置</span>
          </button>
        </div>
      </form>

    </div>
  );
};
