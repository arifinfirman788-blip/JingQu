import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState('suggestion');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setContent('');
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold">帮助与反馈</h2>
          <button onClick={onClose} className="hover:bg-emerald-700 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">已收到！</h3>
            <p className="text-gray-500 mt-2">我们会尽快处理您的反馈。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">反馈类型</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setType('suggestion')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                    type === 'suggestion' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  建议
                </button>
                <button
                  type="button"
                  onClick={() => setType('complaint')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                    type === 'complaint' 
                      ? 'bg-red-50 border-red-500 text-red-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  投诉
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">问题描述</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[100px]"
                placeholder="请详细描述您遇到的问题或建议..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 (选填)</label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="方便我们回访"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
            >
              提交工单
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ComplaintModal;