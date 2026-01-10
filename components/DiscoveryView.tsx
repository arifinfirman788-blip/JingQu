
import React, { useState } from 'react';
import { ArrowLeft, Camera, Mic, Star, X } from 'lucide-react';

interface DiscoveryViewProps {
  onBack: () => void;
  onSelectAction: (query: string) => void;
}

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onBack, onSelectAction }) => {
  const [result, setResult] = useState<string | null>(null);

  const handleSelect = (query: string) => {
    setResult(query);
    onSelectAction(query);
  };

  const mockRankings = [
    {
      name: "贵厨酸汤牛肉火锅",
      rank: "01",
      score: "5.0",
      popularity: "97.51",
      price: "62",
      type: "火锅",
      dist: "1.2Km",
      tags: ["美食销量榜第1名", "贵州菜", "北京路"],
      comment: "爱吃牛肉火锅的真心推荐这家，价格很亲民，环境很干净，真是体验了一次贵州正宗酸汤牛肉的美味，爽",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"
    },
    {
      name: "野山春·贵州现舂酸汤牛肉",
      rank: "02",
      score: "4.9",
      popularity: "95",
      price: "58",
      type: "火锅",
      dist: "1.2Km",
      tags: ["火锅打卡人气榜第2名", "贵州菜", "北京路"],
      comment: "简直太棒了，这个味道太正宗了",
      img: "https://images.unsplash.com/photo-1544013583-490353c74996?w=800"
    }
  ];

  return (
    <div className="absolute inset-0 bg-[#f1f5f2] z-[60] flex flex-col overflow-y-auto pt-12 pb-32 animate-in fade-in duration-500 ease-out scroll-smooth">
      {/* 局部底纹叠加层 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dots-discovery" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#064e3b" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots-discovery)" />
        </svg>
      </div>
      
      <div className="relative z-10">
        {/* 问答结果浮层 */}
        {result && (
          <div className="absolute inset-0 z-[70] bg-black/60 flex items-end animate-in fade-in duration-300">
            <div className="w-full h-[90%] bg-[#f1f5f2] rounded-t-[3rem] flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden relative">
              {/* 浮层内的底纹 */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="url(#dots-discovery)" />
                </svg>
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="p-4 flex justify-end">
                  <button onClick={() => setResult(null)} className="p-2 bg-white rounded-full shadow-md"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-6">
                   <div className="text-sm font-bold text-gray-500 px-2">好的，现在将为您推荐当前的精选排行榜单：</div>
                   
                   {/* 榜单头部装饰 */}
                   <div className="bg-gradient-to-r from-rose-50 via-rose-100/50 to-orange-50 rounded-[2rem] p-6 relative overflow-hidden border border-rose-100/50">
                     <div className="relative z-10">
                       <h2 className="text-3xl font-black text-gray-800">屯堡<span className="text-orange-500">精选榜</span></h2>
                       <div className="flex gap-4 mt-3">
                         {['精选路线', '好评榜', '好玩榜'].map(t => (
                           <div key={t} className="flex items-center gap-1 text-[10px] font-black text-rose-500/80">
                             <CheckCircleIcon size={12}/> {t}
                           </div>
                         ))}
                       </div>
                     </div>
                     <div className="absolute right-[-10px] top-[-10px] opacity-20">
                       <img src="https://picsum.photos/200/200?random=mascot" className="w-32 grayscale" alt="mascot" />
                     </div>
                   </div>

                   {/* 榜单列表项 */}
                   <div className="grid grid-cols-1 gap-6">
                     {mockRankings.map((item, index) => (
                       <div 
                         key={item.rank} 
                         className="bg-white/80 backdrop-blur-2xl rounded-[2.8rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-white group active:scale-[0.98] transition-all duration-500 flex items-center p-5 gap-5"
                       >
                         <div className="relative w-24 h-24 flex-shrink-0">
                           <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-700" />
                           <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-50">
                             <span className={`text-xs font-black ${index < 3 ? 'text-emerald-600' : 'text-gray-400'}`}>{index + 1}</span>
                           </div>
                         </div>
                         
                         <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                             <h3 className="text-base font-black text-gray-900 tracking-tight">{item.name}</h3>
                             <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                               <Star size={10} className="text-emerald-600 fill-current" />
                               <span className="text-[10px] font-black text-emerald-800">{item.score}</span>
                             </div>
                           </div>
                           <p className="text-[11px] text-gray-400 line-clamp-2 mb-3 leading-relaxed font-medium">{item.comment}</p>
                           <div className="flex items-center gap-3">
                             <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                               <span className="text-[9px] font-black text-gray-400">{item.dist}</span>
                             </div>
                             <div className="flex -space-x-2">
                               {[1,2,3].map(i => (
                                 <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                   <img src={`https://i.pravatar.cc/100?img=${i + index * 5}`} alt="user" />
                                 </div>
                               ))}
                             </div>
                             <span className="text-[9px] font-bold text-gray-300">已推荐</span>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm active:scale-90 transition">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
               <Star size={14} className="text-emerald-600 fill-emerald-600"/>
               <span className="text-xs font-black text-emerald-800 tracking-tight">探索发现</span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 leading-tight">
            在这里，<br/>
            <span className="text-emerald-600">发现更多美好事物</span>
          </h2>
        </div>

        <div className="px-6 grid grid-cols-2 gap-4 mt-6">
          {[
            { label: '美食排行', color: 'rose', img: 'https://picsum.photos/300/300?random=food', query: '有哪些美食排行？' },
            { label: '必去景点', color: 'emerald', img: 'https://picsum.photos/300/300?random=spot', query: '有哪些必去景点？' },
            { label: '休闲娱乐', color: 'orange', img: 'https://picsum.photos/300/300?random=fun', query: '有哪些休闲娱乐？' },
            { label: '住宿推荐', color: 'blue', img: 'https://picsum.photos/300/300?random=hotel', query: '有哪些住宿推荐？' },
          ].map(item => (
            <div 
              key={item.label}
              onClick={() => handleSelect(item.query)}
              className="bg-white rounded-[2rem] p-5 shadow-sm border border-white flex flex-col justify-between h-52 relative overflow-hidden active:scale-95 transition cursor-pointer"
            >
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{item.label} List</p>
                <h3 className="text-base font-black text-gray-800 leading-tight">屯堡 <br/> {item.label}</h3>
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-80 rotate-12">
                 <img src={item.img} className="w-full h-full object-cover rounded-2xl" alt={item.label} />
              </div>
              <div className="mt-auto relative z-10">
                 <span className={`bg-${item.color}-50 text-${item.color}-600 text-[10px] px-2 py-1 rounded-full font-bold`}>本地精选</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Floating Bar - Changed to absolute to stay within container */}
        <div className="absolute bottom-10 left-6 right-6 flex items-center gap-3 z-20">
          <div className="flex-1 bg-white h-16 rounded-full shadow-lg border border-gray-100 flex items-center px-6 gap-3">
            <span className="text-gray-400 font-bold">Tt</span>
            <input type="text" placeholder="您正在寻找什么？" readOnly className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-800 pointer-events-none" />
          </div>
          <button className="w-16 h-16 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-800 active:scale-90 transition"><Camera size={24} /></button>
          <button className="w-16 h-16 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-800 active:scale-90 transition"><Mic size={24} /></button>
        </div>
      </div>
    </div>
  );
};

// Helper Icons
const CheckCircleIcon = ({size}: {size: number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export default DiscoveryView;
