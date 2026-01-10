
import { useState, useRef, useEffect } from 'react';
import { 
  Menu, Compass, Map, ShoppingBag, 
  MapPin, CloudSun, ChevronRight, Send, User, Home,
  ClipboardList, PhoneCall, Headphones, Info as InfoIcon, Clock, X, Ticket, Gift, 
  ShieldCheck, FileText, ExternalLink, Volume2, Car, Waves, Navigation,
  Briefcase, Utensils, Search, Package, LifeBuoy, MessageSquareMore, BarChart2
} from 'lucide-react';
import { ViewState, ChatMessage, ComplaintRecord } from './types';
import { sendMessageToGemini } from './services/geminiService';
import MallView from './components/MallView';
import DiscoveryView from './components/DiscoveryView';
import ComplaintView from './components/ComplaintView';
import ServicesView from './components/ServicesView';

// --- 常量与模拟数据 (Update for JingQu) ---
const WEATHER_DATA = { temp: 19, desc: '晴', date: '周三 12/10' };

// 必看攻略数据
const GUIDE_CARDS = [
  { 
    id: 'g1', 
    tag: '#打卡体验', 
    title: '最佳拍照点推荐', 
    image: 'https://picsum.photos/200/200?random=guide1', 
    color: 'bg-blue-100/60', 
    textColor: 'text-blue-600',
    rotate: 'rotate-[-3deg]' 
  },
  { 
    id: 'g2', 
    tag: '#门票费用', 
    title: '门票价格一览', 
    image: 'https://picsum.photos/200/200?random=guide2', 
    color: 'bg-emerald-100/60', 
    textColor: 'text-emerald-600',
    rotate: 'rotate-[3deg]' 
  },
  { 
    id: 'g3', 
    tag: '#最佳时间', 
    title: '推荐游玩时间', 
    image: 'https://picsum.photos/200/200?random=guide3', 
    color: 'bg-orange-100/60', 
    textColor: 'text-orange-600',
    rotate: 'rotate-[-2deg]' 
  },
  { 
    id: 'g4', 
    tag: '#交通指引', 
    title: '直通车时刻表', 
    image: 'https://picsum.photos/200/200?random=guide4', 
    color: 'bg-sky-100/60', 
    textColor: 'text-sky-600',
    rotate: 'rotate-[2deg]' 
  },
];

// 更新预设问题结构
const PRESET_QUESTIONS = [
  { 
    title: '智慧导览', 
    items: [
      { text: '找厕所', icon: Waves },
      { text: '最近餐厅', icon: Utensils },
      { text: '景点讲解', icon: Headphones }
    ] 
  },
  { 
    title: '常见咨询', 
    items: ['开放时间？', '通天河攻略', '门票政策', '游玩线路'] 
  },
];

// 首页改版数据
const TOP_PROMO_CARDS = [
  {
    id: 'p1',
    title: '屯堡文脉',
    subtitle: '探秘大明遗风活化石',
    image: '/assets/promo-1.png',
    tags: ['非遗', '地戏', '石屋', '祈福'],
    color: 'from-emerald-600/80 to-emerald-900/90'
  },
  {
    id: 'p2',
    title: '景区导览',
    subtitle: '智慧导览，随身讲解',
    image: '/assets/promo-2.png',
    tags: ['AR导览', '实时定位'],
    color: 'from-blue-400/80 to-blue-600/90'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [mallConfig, setMallConfig] = useState<{ mode: 'agent' | 'traditional', action?: any }>({ mode: 'agent' });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('我想了解一下通天河的门票及开放时间');
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollRef.current && currentView === ViewState.HOME && !isExiting) {
        const nextIdx = (activeQuestionIdx + 1) % PRESET_QUESTIONS.length;
        const scrollWidth = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({ left: nextIdx * scrollWidth, behavior: 'smooth' });
        setActiveQuestionIdx(nextIdx);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [activeQuestionIdx, currentView, isExiting]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setChatLoading(true);
    const responseText = await sendMessageToGemini(text, [], 'main');
    const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setChatLoading(false);
  };

  const navigateWithAnimation = (targetView?: ViewState, params?: any) => {
    setIsExiting(true);
    setTimeout(() => {
      if (targetView === ViewState.MALL) {
        setMallConfig(params || { mode: 'agent' });
        setCurrentView(ViewState.MALL);
      } else if (targetView) {
        setCurrentView(targetView);
      } else if (params?.initialText) {
        handleSendMessage(params.initialText);
      }
    }, 500);
  };

  const goHome = () => { 
    setIsExiting(false);
    setCurrentView(ViewState.HOME); 
    setMessages([]); 
    setSelectedComplaint(null);
  };

  const renderPersonalCenter = () => (
    <div className="min-h-screen bg-[#f8fafc] pb-32 animate-in fade-in duration-300">
      {/* 顶部个人名片 */}
      <div className="bg-emerald-600 h-64 rounded-b-[4rem] px-6 pt-12 relative shadow-lg">
        <button onClick={goHome} className="p-2 bg-white/20 rounded-full text-white mb-6 active:scale-95 transition">
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full border-4 border-white/40 overflow-hidden shadow-2xl bg-white">
            <img src="https://picsum.photos/200/200?random=mascot" className="w-full h-full object-cover" alt="avatar" />
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-black tracking-tight">屯堡游人_0812</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="bg-emerald-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold border border-white/20 uppercase">Premium Member</span>
            </div>
            <p className="text-[10px] mt-2 opacity-60 font-mono">UID: 2024098231</p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 space-y-4">
        {/* 订单管理 */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/40 border border-gray-50">
          <h3 className="text-xs font-black text-gray-400 mb-6 uppercase tracking-widest px-1">订单与资产</h3>
          <div className="flex justify-around">
            {[
              { label: '我的订单', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: '我的门票', icon: Ticket, color: 'text-rose-500', bg: 'bg-rose-50' },
              { label: '优惠券', icon: Gift, color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-2 group cursor-pointer active:scale-90 transition">
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-inner`}><item.icon size={24} /></div>
                <span className="text-[11px] font-black text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 我的投诉列表 */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/40 border border-gray-50">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">我的投报记录</h3>
            <button onClick={() => navigateWithAnimation(ViewState.COMPLAINT)} className="text-[10px] font-black text-emerald-600">新建投诉 +</button>
          </div>
          {complaints.length > 0 ? (
            <div className="space-y-3">
              {complaints.map(record => (
                <div 
                  key={record.id} 
                  onClick={() => setSelectedComplaint(record)}
                  className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 active:bg-emerald-50 transition-colors flex justify-between items-center group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-black text-gray-800 truncate leading-tight">{record.content}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-2">
                      <Clock size={10}/> {new Date(record.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${record.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {record.status === 'pending' ? '处理中' : '已回复'}
                    </span>
                    <ChevronRight size={12} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
               <p className="text-xs font-black text-gray-300 italic">暂无工单记录，愿您的旅程一切顺利</p>
            </div>
          )}
        </div>

        {/* 服务热线与支持 - 艺术化卡片 */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.8rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-white">
          <h3 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.2em] px-1">服务热线</h3>
          <div className="grid grid-cols-1 gap-4">
            <a href="tel:4001234567" className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 shadow-sm active:scale-95 transition-all duration-300 group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 transition-transform group-hover:rotate-12"><Headphones size={22} /></div>
                <div>
                   <p className="text-sm font-black text-gray-900 leading-none mb-1.5">在线客服</p>
                   <p className="text-[10px] text-emerald-600 font-bold tracking-tight">24小时为您守候</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                <ChevronRight size={14} />
              </div>
            </a>
            <a href="tel:08511234567" className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 shadow-sm active:scale-95 transition-all duration-300 group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:-rotate-12"><PhoneCall size={22} /></div>
                <div>
                   <p className="text-sm font-black text-gray-900 leading-none mb-1.5">咨询/救援</p>
                   <p className="text-[10px] text-blue-600 font-bold tracking-tight">0851-12345678</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <ExternalLink size={14} />
              </div>
            </a>
          </div>
        </div>

        {/* 协议与规则 - 极简列表 */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.8rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-white">
          <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em] px-1">协议与规则</h3>
          <div className="space-y-1">
            {[
              { label: '用户服务协议', icon: ShieldCheck },
              { label: '隐私政策条款', icon: FileText },
              { label: '景区游玩守则', icon: InfoIcon },
            ].map(item => (
              <button key={item.label} className="w-full py-4 flex items-center justify-between active:bg-white/80 rounded-2xl transition-all duration-300 px-3 group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                    <item.icon size={16} />
                  </div>
                  <span className="text-[13px] font-black text-gray-700 group-hover:text-gray-900 transition-colors">{item.label}</span>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 工单详情抽屉 */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom duration-500">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-lg font-black text-gray-900">工单详情追踪</h3>
                 <button onClick={() => setSelectedComplaint(null)} className="p-2 bg-gray-100 rounded-full"><X size={18}/></button>
              </div>
              <div className="space-y-4">
                 <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">反馈内容</p>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed">{selectedComplaint.content}</p>
                 </div>
                 <div className="relative pl-8 space-y-6">
                    <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-emerald-100"></div>
                    <div className="relative">
                       <div className="absolute -left-8 top-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm shadow-emerald-200"></div>
                       <p className="text-[11px] font-black text-gray-400 mb-1">
                         {selectedComplaint.status === 'pending' ? '受理中' : '处理完成'}
                       </p>
                       <p className="text-xs font-bold text-gray-800">
                         {selectedComplaint.status === 'pending' 
                           ? '您的反馈已通过系统审核，工作人员正快马加鞭核实情况...' 
                           : '工作人员已处理完毕：已通过后台核实并修复相关问题，感谢您的热心反馈！'}
                       </p>
                    </div>
                    <div className="relative opacity-40">
                       <div className="absolute -left-8 top-1 w-2.5 h-2.5 bg-gray-300 rounded-full border-2 border-white"></div>
                       <p className="text-[11px] font-black text-gray-400 mb-1">提交成功</p>
                       <p className="text-xs font-bold text-gray-500">{new Date(selectedComplaint.timestamp).toLocaleString()}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 py-12 font-['Noto_Sans_SC'] overflow-auto selection:bg-emerald-100 selection:text-emerald-900">
      <style>{`
        @keyframes shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shine {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shine 3s infinite linear;
        }
        .bento-card-shadow {
          box-shadow: 0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02), 0 12px 24px rgba(0,0,0,0.04);
        }
      `}</style>
      {/* 手机外框 - 增强细节版 */}
      <div className="relative mx-auto border-[#1a1a1a] bg-[#1a1a1a] border-[14px] rounded-[3.5rem] h-[844px] w-[390px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/10">
        {/* 天线断点 */}
        <div className="absolute top-[120px] -left-[14px] w-1 h-2 bg-[#2a2a2a] z-50"></div>
        <div className="absolute top-[120px] -right-[14px] w-1 h-2 bg-[#2a2a2a] z-50"></div>
        <div className="absolute bottom-[120px] -left-[14px] w-1 h-2 bg-[#2a2a2a] z-50"></div>
        <div className="absolute bottom-[120px] -right-[14px] w-1 h-2 bg-[#2a2a2a] z-50"></div>

        {/* 音量键 */}
        <div className="h-[32px] w-[3px] bg-[#1a1a1a] absolute -left-[17px] top-[72px] rounded-l-lg shadow-[inset_-1px_0_2px_rgba(255,255,255,0.1)]"></div>
        <div className="h-[46px] w-[3px] bg-[#1a1a1a] absolute -left-[17px] top-[124px] rounded-l-lg shadow-[inset_-1px_0_2px_rgba(255,255,255,0.1)]"></div>
        <div className="h-[46px] w-[3px] bg-[#1a1a1a] absolute -left-[17px] top-[178px] rounded-l-lg shadow-[inset_-1px_0_2px_rgba(255,255,255,0.1)]"></div>
        
        {/* 电源键 */}
        <div className="h-[64px] w-[3px] bg-[#1a1a1a] absolute -right-[17px] top-[142px] rounded-r-lg shadow-[inset_1px_0_2px_rgba(255,255,255,0.1)]"></div>

        {/* 屏幕内容区域 */}
        <div className="rounded-[2.5rem] overflow-hidden w-full h-full bg-[#f1f5f2] relative ring-1 ring-black/5">
          {/* 刘海/灵动岛 - 增强细节 */}
          <div className="absolute top-0 inset-x-0 h-10 z-[100] flex items-center justify-center pointer-events-none">
            <div className="w-[110px] h-[30px] bg-black rounded-full mt-3 shadow-2xl flex items-center justify-end px-4 gap-2">
               <div className="w-2 h-2 rounded-full bg-[#1a1a1a] ring-1 ring-white/5"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] ring-1 ring-white/10"></div>
            </div>
          </div>

          {/* 状态栏模拟 */}
          <div className="absolute top-0 inset-x-0 h-10 z-[90] flex justify-between items-center px-8 pt-2 text-black pointer-events-none">
            <span className="text-[12px] font-black">9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 items-end h-3">
                <div className="w-0.5 h-[30%] bg-black rounded-full"></div>
                <div className="w-0.5 h-[50%] bg-black rounded-full"></div>
                <div className="w-0.5 h-[75%] bg-black rounded-full"></div>
                <div className="w-0.5 h-full bg-black rounded-full"></div>
              </div>
              <span className="text-[10px] font-black">5G</span>
              <div className="w-6 h-3 border border-black/30 rounded-[3px] p-0.5 flex items-center relative">
                <div className="w-full h-full bg-black rounded-[1px]"></div>
                <div className="absolute -right-1 top-1 w-0.5 h-1 bg-black/30 rounded-r-full"></div>
              </div>
            </div>
          </div>

          {/* 实际应用内容容器 */}
          <div className="w-full h-full relative">
            {/* 全局底纹叠加层 */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dots-app" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#064e3b" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots-app)" />
              </svg>
            </div>

            <div className="relative z-10 w-full h-full">
              {currentView === ViewState.MALL && <MallView onBack={goHome} initialMode={mallConfig.mode} initialAction={mallConfig.action} />}
              {currentView === ViewState.SERVICES && <ServicesView onBack={goHome} onAction={(action) => handleSendMessage(action)} />}
              {currentView === ViewState.NEARBY_DISCOVERY && <DiscoveryView onBack={goHome} onSelectAction={handleSendMessage} />}
              {currentView === ViewState.COMPLAINT && <ComplaintView onBack={goHome} onSubmit={(rec) => setComplaints([rec, ...complaints])} />}
              {currentView === ViewState.PERSONAL_CENTER && renderPersonalCenter()}
              
              {currentView === ViewState.HOME && (
                <div className="w-full h-full overflow-y-auto no-scrollbar pt-10 pb-32 scroll-smooth">
                  <div className={`pb-10 transition-all duration-700 ease-in-out`}>
                    <header className={`px-5 pt-12 pb-4 flex justify-between items-start sticky top-0 bg-[#f1f5f2]/80 backdrop-blur-md z-30 transition-transform duration-500 ${isExiting ? '-translate-y-full opacity-0' : ''}`}>
            <div className="flex flex-col gap-2 w-full max-w-[68%]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100/50 rounded-xl"><Menu className="text-emerald-900" size={20} /></div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">云峰屯堡</h1>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
                <div className="bg-orange-500 p-1 rounded-lg shrink-0 z-10 animate-pulse"><Volume2 size={12} className="text-white" /></div>
                <div className="overflow-hidden w-full relative h-4">
                  <span className="animate-marquee absolute whitespace-nowrap text-[11px] font-black text-gray-700 tracking-wide">
                    景区特别通告：今日 14:30 屯堡地戏准时开演，请各位游客于演武场集合；通天河水位正常。
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end pt-1">
               <div className="flex items-center bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-full px-2 py-1.5 gap-2.5 mb-2 shadow-sm">
                  <div className="px-1"><div className="flex gap-0.5"><div className="w-1 h-1 bg-gray-800 rounded-full"></div><div className="w-1 h-1 bg-gray-800 rounded-full"></div><div className="w-1 h-1 bg-gray-800 rounded-full"></div></div></div>
                  <div className="w-px h-3.5 bg-gray-300/80"></div>
                  <div className="px-1"><div className="w-4 h-4 rounded-full border border-gray-800 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div></div></div>
               </div>

               <div className="mt-0 text-right">
                <div className="flex items-center gap-1.5 justify-end mb-2">
                  <CloudSun size={14} className="text-orange-400" />
                  <span className="text-sm font-black text-gray-800 tracking-tight">{WEATHER_DATA.temp}°C {WEATHER_DATA.desc}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-emerald-700 font-black tracking-tight">舒适度：舒适</p>
                </div>
              </div>
            </div>
          </header>

          {/* 首页改版：顶部大卡片 */}
          <div className={`px-5 mt-4 grid grid-cols-2 gap-4 transition-all duration-500 ${isExiting ? 'opacity-0 scale-95' : ''}`}>
            <div 
              onClick={() => navigateWithAnimation(ViewState.NEARBY_DISCOVERY)}
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer active:scale-95 transition-transform"
            >
              <img src={TOP_PROMO_CARDS[0].image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={TOP_PROMO_CARDS[0].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="drop-shadow-lg">
                  <h3 className="text-xl font-black tracking-tight mb-1">{TOP_PROMO_CARDS[0].title}</h3>
                  <p className="text-[10px] font-bold opacity-90 leading-tight">{TOP_PROMO_CARDS[0].subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {TOP_PROMO_CARDS[0].tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black shadow-sm">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigateWithAnimation(ViewState.MALL)}
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer active:scale-95 transition-transform"
            >
              <img src={TOP_PROMO_CARDS[1].image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={TOP_PROMO_CARDS[1].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="drop-shadow-lg">
                  <h3 className="text-xl font-black tracking-tight mb-1">{TOP_PROMO_CARDS[1].title}</h3>
                  <p className="text-[10px] font-bold opacity-90 leading-tight">{TOP_PROMO_CARDS[1].subtitle}</p>
                  <div className="flex gap-2 mt-3">
                    {TOP_PROMO_CARDS[1].tags?.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 首页改版：数据驱动的“智慧服务”入口 */}
          <div className={`px-5 mt-8 transition-all duration-1000 ${isExiting ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
            <div className="flex flex-col gap-4">
              {/* 主入口：大客流/车位实时看板 */}
              <button 
                onClick={() => navigateWithAnimation(ViewState.SERVICES)}
                className="w-full bg-white rounded-[2.8rem] p-7 relative overflow-hidden group active:scale-[0.98] transition-all bento-card-shadow border border-emerald-100/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent"></div>
                
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                        <BarChart2 size={18} />
                      </div>
                      <h4 className="text-lg font-black text-gray-900 tracking-tight">智慧服务中心</h4>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black text-emerald-700">实时数据已更新</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 divide-x divide-gray-100">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-gray-900 tabular-nums tracking-tighter">7,152</span>
                        <div className="bg-emerald-500 text-white px-1.5 py-0.5 rounded-md text-[9px] font-black">舒适</div>
                      </div>
                      <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                        <User size={12} className="text-gray-300" /> 当前景区人数
                      </p>
                    </div>
                    
                    <div className="pl-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-gray-900 tabular-nums tracking-tighter">346</span>
                        <div className="bg-blue-500 text-white px-1.5 py-0.5 rounded-md text-[9px] font-black">充足</div>
                      </div>
                      <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                        <Car size={12} className="text-gray-300" /> 剩余空车位
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-50 rounded-2xl p-4 flex items-center justify-between group-hover:bg-emerald-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Navigation className="text-emerald-600" size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-gray-800">离您最近的洗手间</p>
                        <p className="text-[10px] text-gray-400 font-bold">步行约 200米 | 优级卫生</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>

              {/* 快捷次入口：横向数据流 */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigateWithAnimation(ViewState.SERVICES, { action: '金牌解说' })}
                  className="bg-white rounded-[2rem] p-5 border border-purple-50 flex items-center gap-3 active:scale-95 transition-all bento-card-shadow"
                >
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <Headphones size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">景点语音</p>
                    <p className="text-sm font-black text-gray-900">24个景点在听</p>
                  </div>
                </button>
                <button 
                  onClick={() => navigateWithAnimation(ViewState.SERVICES, { action: '行李管家' })}
                  className="bg-white rounded-[2rem] p-5 border border-orange-50 flex items-center gap-3 active:scale-95 transition-all bento-card-shadow"
                >
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Package size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">寄存服务</p>
                    <p className="text-sm font-black text-gray-900">3处可用点位</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 还原：必看攻略 */}
          <div className={`mt-10 transition-all duration-700 delay-300 ${isExiting ? 'opacity-0 translate-y-20' : ''}`}>
            <div className="px-5 mb-4 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-4 h-4 border-2 border-emerald-900 rotate-45 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-emerald-900"></div></div>
                <div className="w-4 h-4 border-2 border-emerald-900 rotate-45 flex items-center justify-center ml-[-4px]"><div className="w-1.5 h-1.5 bg-emerald-900"></div></div>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">必看攻略</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2 relative">
                <svg className="absolute -top-3 left-0 w-full h-6 opacity-20" viewBox="0 0 100 24">
                  <path d="M0 12 Q 25 2, 50 12 T 100 12" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-900" />
                </svg>
              </div>
            </div>

            <div className="flex overflow-x-auto gap-4 px-5 pb-6 no-scrollbar snap-x">
              {GUIDE_CARDS.map((guide) => (
                <div key={guide.id} className={`flex-shrink-0 w-[200px] bg-white rounded-[2rem] p-4 shadow-xl shadow-gray-200/40 border border-gray-50 snap-start transform ${guide.rotate} hover:rotate-0 transition-transform duration-500`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${guide.color} rounded-2xl overflow-hidden shadow-inner flex-shrink-0`}>
                      <img src={guide.image} className="w-full h-full object-cover" alt={guide.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-emerald-600 mb-0.5">{guide.tag}</p>
                      <h4 className="text-xs font-black text-gray-800 leading-tight truncate">{guide.title}</h4>
                    </div>
                    <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Navigation size={10} className="text-emerald-500 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

        {/* 底部悬浮船坞导航栏 (Floating Dynamic Dock) */}
        {messages.length === 0 && (currentView === ViewState.HOME || currentView === ViewState.PERSONAL_CENTER || currentView === ViewState.NEARBY_DISCOVERY || currentView === ViewState.MALL || currentView === ViewState.SERVICES) && (
          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-[92%] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isExiting ? 'translate-y-20 opacity-0 scale-90' : 'translate-y-0 opacity-100 scale-100'}`}>
            <div className="relative">
              {/* 背景容器 - 玻璃拟态 */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40"></div>
              
              <div className="relative flex justify-between items-center px-4 h-20">
                {/* 左侧按钮组 */}
                <div className="flex gap-1 flex-1 justify-around">
                  {[
                    { view: ViewState.HOME, icon: Home, label: '首页' },
                    { view: ViewState.SERVICES, icon: Briefcase, label: '服务' }
                  ].map((item) => (
                    <button 
                      key={item.view}
                      onClick={() => { setIsExiting(false); setCurrentView(item.view); }} 
                      className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 group overflow-hidden ${currentView === item.view ? 'text-emerald-600' : 'text-gray-400'}`}
                    >
                      {currentView === item.view && (
                        <div className="absolute inset-0 bg-emerald-50/80 animate-in fade-in zoom-in duration-300"></div>
                      )}
                      <item.icon size={22} className={`relative z-10 transition-transform duration-500 ${currentView === item.view ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className={`relative z-10 text-[8px] font-black mt-1 transition-opacity duration-300 ${currentView === item.view ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* 中央吉祥物 - 突破边界设计 */}
                <div className="relative w-24 -mt-10">
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-100/40 to-transparent rounded-full blur-2xl -z-10 animate-pulse"></div>
                  <button 
                    onMouseUp={() => setIsVoiceModalOpen(true)} 
                    className="relative w-24 h-24 flex items-center justify-center active:scale-90 transition-all duration-500 group"
                  >
                    {/* 呼吸灯环 */}
                    <div className="absolute inset-4 bg-emerald-400/20 rounded-full animate-[ping_3s_infinite]"></div>
                    <div className="absolute inset-6 bg-white rounded-full shadow-2xl border-4 border-emerald-50 transition-transform group-hover:scale-105"></div>
                    <img 
                      src="https://img.lenyiin.com/app/hide.php?key=YnppcCs3YjlBUEhmUkM4RkhYU1JPdFc0QlNGdmpoaXZTNDJDSHRZPQ==" 
                      className="relative w-full h-full object-contain -mt-4 scale-125 z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-6" 
                      alt="Mascot" 
                    />
                    <div className="absolute -bottom-2 bg-emerald-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">智能语音</div>
                  </button>
                </div>

                {/* 右侧按钮组 */}
                <div className="flex gap-1 flex-1 justify-around">
                  {[
                    { view: ViewState.MALL, icon: ShoppingBag, label: '商城' },
                    { view: ViewState.PERSONAL_CENTER, icon: User, label: '我的' }
                  ].map((item) => (
                    <button 
                      key={item.view}
                      onClick={() => { setIsExiting(false); setCurrentView(item.view); }} 
                      className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 group overflow-hidden ${currentView === item.view ? 'text-emerald-600' : 'text-gray-400'}`}
                    >
                      {currentView === item.view && (
                        <div className="absolute inset-0 bg-emerald-50/80 animate-in fade-in zoom-in duration-300"></div>
                      )}
                      <item.icon size={22} className={`relative z-10 transition-transform duration-500 ${currentView === item.view ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className={`relative z-10 text-[8px] font-black mt-1 transition-opacity duration-300 ${currentView === item.view ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 语音模态框 - 放在屏幕容器内 */}
        {isVoiceModalOpen && (
          <div className="absolute inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
             <div className="w-full bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom duration-500 shadow-2xl">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-xs font-black text-gray-400 uppercase tracking-widest">识别结果</span></div>
                   <button onClick={() => setIsVoiceModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X size={16}/></button>
                </div>
                <div className="bg-emerald-50/50 rounded-3xl p-6 border-2 border-emerald-100/50"><textarea value={voiceText} onChange={(e) => setVoiceText(e.target.value)} className="w-full bg-transparent border-none outline-none text-lg font-black text-gray-800 leading-relaxed resize-none h-24"/></div>
                <div className="flex gap-4">
                   <button onClick={() => setIsVoiceModalOpen(false)} className="flex-1 py-4 rounded-3xl font-black text-gray-400 bg-gray-100 active:scale-95 transition">重新录音</button>
                   <button onClick={() => { setIsVoiceModalOpen(false); navigateWithAnimation(undefined, { initialText: voiceText }); }} className="flex-[2] py-4 rounded-3xl font-black text-white bg-emerald-600 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition"><Send size={18}/>确认发送</button>
                </div>
             </div>
          </div>
        )}

        {/* 聊天界面 - 放在屏幕容器内 */}
        {messages.length > 0 && (
          <div className="absolute inset-0 z-[100] bg-[#f1f5f2] flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
            {/* 局部底纹叠加层 */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots-chat" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#064e3b" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dots-chat)" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-xl">
                 <button onClick={() => { setIsExiting(false); setMessages([]); }} className="p-2 bg-gray-50 rounded-full"><ChevronRight className="rotate-180" size={20}/></button>
                 <h2 className="font-black text-gray-900">AI 智能伴游</h2>
                 <div className="w-10"></div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && <div className="w-9 h-9 rounded-2xl bg-emerald-500 flex-shrink-0 mr-3 flex items-center justify-center text-white"><Compass size={18}/></div>}
                    <div className={`max-w-[82%] p-5 rounded-[2.2rem] text-[13px] font-bold leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-md shadow-gray-200/20'}`}>{msg.text}</div>
                  </div>
                ))}
                {chatLoading && <div className="flex justify-start gap-3 items-center"><div className="w-9 h-9 rounded-2xl bg-emerald-50 animate-pulse"></div><div className="bg-white p-4 rounded-3xl flex gap-1.5 border border-gray-100"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></div></div></div>}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-6 pb-12 bg-white border-t border-gray-100"><div className="flex items-center gap-4 bg-gray-50 p-2 pl-6 rounded-full border border-gray-100"><input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="继续提问..." className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-800" /><button onClick={() => handleSendMessage()} className="p-3 bg-emerald-600 text-white rounded-full shadow-lg"><Send size={20} /></button></div></div>
            </div>
          </div>
        )}

        {/* 屏幕底部的 Home 指示条 */}
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-[120]">
          <div className="w-32 h-1 bg-black/20 rounded-full"></div>
        </div>
      </div>

      {/* 手机底部细节：充电口与扬声器 */}
      <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-1 opacity-80 pointer-events-none">
        <div className="flex gap-12 items-center">
          <div className="flex gap-1">
            {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>)}
          </div>
          <div className="w-14 h-2 bg-[#1a1a1a] rounded-full shadow-inner"></div>
          <div className="flex gap-1">
            {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>)}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
