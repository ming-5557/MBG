import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Maximize2, Sparkles, Image as ImageIcon, Heart, X, Edit2, Trash2 } from 'lucide-react';
import { Memory } from '../types';
import { dataService } from '../services/dataService';
import { Lightbox } from '../components/Lightbox';
import { MediaUploader } from '../components/MediaUploader';

export const Gallery: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Memory | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Photo form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'first_date' | 'travel' | 'anniversary' | 'celebration' | 'daily'>('daily');
  const [photoUrl, setPhotoUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    const data = await dataService.getMemories();
    setMemories(data.filter((m) => Boolean(m.photo_url)));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingPhoto(null);
    setTitle('');
    setCategory('daily');
    setPhotoUrl('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (photo: Memory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPhoto(photo);
    setTitle(photo.title);
    setCategory(photo.category || 'daily');
    setPhotoUrl(photo.photo_url || '');
    setDate(photo.date || new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) return;

    if (editingPhoto) {
      await dataService.updateMemory({
        ...editingPhoto,
        title: title || '相册照片',
        category,
        photo_url: photoUrl,
        date
      });
    } else {
      await dataService.addMemory({
        title: title || '相册照片',
        description: '记录在我们的情侣相册中',
        date,
        photo_url: photoUrl,
        category
      });
    }

    setIsModalOpen(false);
    await loadData();
  };

  const handleDeletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await dataService.deleteMemory(id);
    await loadData();
  };

  const albums = [
    { id: 'all', label: '全部照片' },
    { id: 'first_date', label: '表白日' },
    { id: 'travel', label: '游玩' },
    { id: 'anniversary', label: '纪念日' },
    { id: 'daily', label: '每日的笑容' }
  ];

  const filteredPhotos = memories.filter((m) => {
    if (activeAlbum === 'all') return true;
    return m.category === activeAlbum;
  });

  const activePhoto = lightboxIdx !== null ? filteredPhotos[lightboxIdx] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>浪漫照片库</span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-800">
            我们的相册
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            捕捉我们最喜欢的瞬间、旅行以及在一起的静谧时光。
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-200 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>上传照片</span>
        </button>
      </div>

      {/* Album Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setActiveAlbum(album.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeAlbum === album.id
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-white/80 text-slate-600 border border-rose-100 hover:bg-rose-50'
            }`}
          >
            {album.label}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filteredPhotos.map((item, idx) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIdx(idx)}
            className="relative group rounded-3xl overflow-hidden glass-card cursor-pointer border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 break-inside-avoid"
          >
            <img
              src={item.photo_url}
              alt={item.title}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Quick Actions overlay top right */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-1.5 z-10">
              <button
                onClick={(e) => openEditModal(item, e)}
                className="p-1.5 rounded-full bg-white/90 text-slate-700 hover:text-rose-600 shadow-md backdrop-blur-xs transition-colors"
                title="编辑照片"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => handleDeletePhoto(item.id, e)}
                className="p-1.5 rounded-full bg-white/90 text-slate-700 hover:text-rose-600 shadow-md backdrop-blur-xs transition-colors"
                title="删除照片"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">{item.date}</span>
              <h4 className="font-serif font-bold text-sm text-white truncate">{item.title}</h4>
              <div className="flex items-center space-x-1 text-[11px] text-rose-200 mt-1">
                <Maximize2 className="w-3 h-3" />
                <span>点击查看大图</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-16 glass-card rounded-3xl p-8 border border-rose-100">
          <Sparkles className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h4 className="font-serif font-bold text-lg text-slate-800">这个相册里还没有照片哦</h4>
          <p className="text-xs text-slate-500 mt-1">上传一张新照片，加入到我们的爱情画廊吧！</p>
        </div>
      )}

      {/* Upload/Edit Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 pt-16 sm:pt-20 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-rose-200 flex flex-col max-h-[90vh] my-auto overflow-hidden"
          >
            <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between shrink-0 bg-white">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-800 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-rose-500" />
                <span>{editingPhoto ? '编辑照片' : '上传到相册'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="flex flex-col overflow-hidden flex-1">
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">照片标题 / 描述</label>
                  <input
                    type="text"
                    placeholder="例如：京都的日落"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:border-rose-400 text-xs sm:text-sm outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">相册分类</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs sm:text-sm outline-none bg-white"
                    >
                      <option value="first_date">表白日</option>
                      <option value="travel"> 游玩</option>
                      <option value="anniversary">纪念日</option>
                      <option value="daily">每日的笑容</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">拍摄日期</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs sm:text-sm outline-none bg-white"
                    />
                  </div>
                </div>

                <MediaUploader
                  bucket="photos"
                  label="上传照片（文件或链接）"
                  accept="image/*"
                  value={photoUrl}
                  onChange={setPhotoUrl}
                />
              </div>

              <div className="p-4 sm:p-5 border-t border-rose-100 flex items-center justify-end space-x-3 shrink-0 bg-white/95 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!photoUrl}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md disabled:opacity-50 hover:scale-105 transition-all"
                >
                  {editingPhoto ? '更新照片' : '保存照片'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Lightbox Preview */}
      <Lightbox
        isOpen={lightboxIdx !== null}
        onClose={() => setLightboxIdx(null)}
        mediaUrl={activePhoto?.photo_url || ''}
        mediaType="image"
        title={activePhoto?.title}
        description={activePhoto?.description}
        hasPrev={lightboxIdx !== null && lightboxIdx > 0}
        hasNext={lightboxIdx !== null && lightboxIdx < filteredPhotos.length - 1}
        onPrev={() => setLightboxIdx((idx) => (idx !== null ? Math.max(0, idx - 1) : null))}
        onNext={() => setLightboxIdx((idx) => (idx !== null ? Math.min(filteredPhotos.length - 1, idx + 1) : null))}
      />
    </div>
  );
};
