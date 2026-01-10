
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShoppingBag, Star, Ticket, Gift, Headphones, ChevronRight, Send, Sparkles, ShoppingCart, UserCheck, Plus, Navigation } from 'lucide-react';
import { Product } from '../types';

interface MallViewProps {
  onBack: () => void;
  initialMode?: 'agent' | 'traditional';
  initialAction?: 'ticket' | 'gift' | 'guide';
}

interface MallMessage {
  id: string;
  role: 'user' | 'model';
  type: 'text' | 'product';
  content?: string;
  product?: Product & { desc?: string };
}

const PRODUCTS: Product[] = [
  { id: '1', name: '屯堡银饰', price: 299, image: 'https://picsum.photos/300/300?random=101' },
  { id: '2', name: '传统蜡染围巾', price: 128, image: 'https://picsum.photos/300/300?random=102' },
  { id: '3', name: '特产辣椒酱礼盒', price: 58, image: 'https://picsum.photos/300/300?random=103' },
  { id: '4', name: '地戏面具', price: 199, image: 'https://picsum.photos/300/300?random=104' },
];

const MallView: React.FC<MallViewProps> = ({ onBack, initialMode = 'agent', initialAction }) => {
  const [viewMode, setViewMode] = useState<'agent' | 'traditional'>(initialMode);
  const [messages, setMessages] = useState<MallMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialAction) {
      handleServiceClick(initialAction);
    }
  }, [initialAction]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleServiceClick = (type: string) => {
    let mockResponse: MallMessage;
    const timestamp = Date.now().toString();

    if (type === 'ticket') {
      mockResponse = {
        id: timestamp,
        role: 'model',
        type: 'product',
        product: { id: 't1', name: '云峰屯堡成人通票', price: 80, image: 'https://picsum.photos/400/300?random=ticket', desc: '含所有景点及地戏表演观摩' }
      };
    } else if (type === 'gift') {
      mockResponse = {
        id: timestamp,
        role: 'model',
        type: 'product',
        product: { id: 'g1', name: '非遗手工地戏面具(小)', price: 158, image: 'https://picsum.photos/400/300?random=mask', desc: '纯木手工雕刻，非遗匠人打造' }
      };
    } else {
      mockResponse = {
        id: timestamp,
        role: 'model',
        type: 'product',
        product: { id: 's1', name: 'VIP私享讲解服务(2小时)', price: 120, image: 'https://picsum.photos/400/300?random=guide', desc: '金牌讲解员带您深度游屯堡' }
      };
    }
    setMessages(prev => [...prev, mockResponse]);
  };

  const renderAgentHome = () => (
    <div className="flex flex-col h-full bg-[#f1f5f2] animate-in fade-in duration-500 overflow-y-auto no-scrollbar relative">
      {/* 局部底纹叠加层 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dots-mall" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#064e3b" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots-mall)" />
        </svg>
      </div>
      <div className="relative z-10">
        {/* 头部 */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm active:scale-90 transition">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
               <Sparkles size={14} className="text-emerald-600"/>
               <span className="text-xs font-black text-emerald-800 tracking-tight">智能订购助手</span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 leading-tight">
            您好，<br/>
            <span className="text-emerald-600">想带走哪份惊喜？</span>
          </h2>
        </div>

        <div className="px-6 space-y-10 pb-32">
          {/* 商城中心任务台 */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/5 rounded-[2.5rem] p-1 border border-white shadow-xl shadow-indigo-100/30">
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.2rem] flex items-center p-2 h-36">
               <div className="w-1/3 flex flex-col items-center justify-center border-r border-indigo-100/50">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 font-mono">Mall Center</span>
                  <h3 className="text-xl font-black text-indigo-900">商城中心</h3>
                  <button onClick={() => setViewMode('traditional')} className="mt-2 bg-indigo-600 px-3 py-1 rounded-full flex items-center gap-1 active:scale-95 transition shadow-lg shadow-indigo-200">
                    <span className="text-[9px] font-bold text-white">立即查看</span>
                    <ChevronRight size={10} className="text-white"/>
                  </button>
               </div>
               <div className="flex-1 flex overflow-x-auto no-scrollbar gap-3 px-4">
                  {[
                    { id: 'ticket', label: '门票购买', icon: Ticket, color: 'bg-blue-500', sub: '快速入园' },
                    { id: 'gift', label: '文创购买', icon: Gift, color: 'bg-rose-500', sub: '屯堡精选' },
                    { id: 'guide', label: '讲解购买', icon: Headphones, color: 'bg-emerald-500', sub: '深度体验' },
                  ].map((item) => (
                    <button key={item.id} onClick={() => handleServiceClick(item.id)} className="shrink-0 w-24 h-28 bg-white/60 rounded-3xl p-3 flex flex-col items-center justify-between border border-white active:scale-95 transition group">
                      <div className={`w-10 h-10 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <item.icon size={20} />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-black text-gray-800">{item.label}</p>
                        <p className="text-[8px] font-bold text-gray-400 whitespace-nowrap">{item.sub}</p>
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* 聊天记录区 */}
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-in slide-in-from-bottom duration-300">
                {msg.type === 'product' && msg.product && (
                  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-white">
                    <div className="relative h-44">
                      <img src={msg.product.image} className="w-full h-full object-cover" alt={msg.product.name} />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white">
                        <span className="text-sm font-black text-emerald-600">¥{msg.product.price}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-black text-gray-900 mb-1">{msg.product.name}</h4>
                      <p className="text-xs font-bold text-gray-400 mb-4">{msg.product.desc}</p>
                      <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 transition">
                          <ShoppingCart size={18}/>
                          {msg.product.id.startsWith('t') ? '立即购票' : '加入购物车'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 猜您想问 */}
          <div className="space-y-4 pb-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">猜您想问</p>
            {[
              '有哪些必买的非遗纪念品？',
              '如何购买儿童票或学生票？',
              '现在购买讲解服务需要预约吗？',
            ].map((q, idx) => (
              <button key={idx} className="w-full text-left bg-white/60 backdrop-blur-xl p-5 rounded-[2.2rem] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex justify-between items-center group active:scale-[0.98] transition-all duration-500">
                <span className="text-sm font-black text-gray-800 tracking-tight group-hover:text-emerald-600 transition-colors">{q}</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTraditionalMall = () => (
    <div className="flex flex-col h-full bg-[#f1f5f2] animate-in slide-in-from-right duration-500 pb-32 relative">
      {/* 局部底纹叠加层 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dots-trad" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#064e3b" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots-trad)" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setViewMode('agent')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full active:scale-90 transition">
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-black text-gray-800">全部好物</h1>
          </div>
          <div className="relative">
            <ShoppingCart size={24} className="text-gray-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">2</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
            {['全部精品', '当地特产', '文创周边', '门票预约', '非遗手工'].map((cat, idx) => (
              <button 
                key={idx} 
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black transition-all duration-500 shadow-sm border ${
                  idx === 0 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200' 
                    : 'bg-white text-gray-500 border-white hover:border-emerald-100 hover:text-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-5 mt-4">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden group border border-white active:scale-95 transition-all duration-500">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-gray-900 text-[11px] line-clamp-1 mb-3 tracking-tight">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-600 font-black text-base tracking-tighter">¥{product.price}</span>
                    <button className="bg-emerald-600 text-white p-2 rounded-2xl shadow-lg shadow-emerald-100 group-hover:rotate-12 transition-all">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-[#f1f5f2] z-[60] overflow-hidden">
      {viewMode === 'agent' ? renderAgentHome() : renderTraditionalMall()}
    </div>
  );
};

export default MallView;
