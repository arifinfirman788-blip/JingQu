
import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { ComplaintRecord } from '../types';

interface ComplaintViewProps {
  onBack: () => void;
  onSubmit: (record: ComplaintRecord) => void;
}

const ComplaintView: React.FC<ComplaintViewProps> = ({ onBack, onSubmit }) => {
  const [type, setType] = useState<'suggestion' | 'complaint'>('suggestion');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newRecord: ComplaintRecord = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      status: 'pending',
      timestamp: Date.now(),
    };

    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(newRecord);
      onBack();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-[#f1f5f2] z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      {/* 局部底纹叠加层 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dots-complaint" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#064e3b" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots-complaint)" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="bg-white/80 backdrop-blur-md p-5 pt-12 flex items-center justify-between border-b border-gray-100 sticky top-0">
          <button onClick={onBack} className="p-2 bg-gray-50 rounded-full active:scale-90 transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="font-black text-gray-900">投诉与建议</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-900">提交成功</h3>
              <p className="text-gray-500 text-sm">您的反馈已收到，可在个人中心查看进度</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">反馈类型</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setType('suggestion')}
                    className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${
                      type === 'suggestion' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    意见建议
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('complaint')}
                    className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${
                      type === 'complaint' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    问题投诉
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">详细描述</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请详细说明您遇到的情况，我们将尽快为您处理..."
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold min-h-[160px] outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all border-none"
                />
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">联系方式 (选填)</label>
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="方便我们及时告知处理结果"
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all border-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 transition mt-8"
              >
                <Send size={18} />
                确认提交反馈
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintView;
