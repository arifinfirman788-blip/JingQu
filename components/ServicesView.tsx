
import React from 'react';
import { 
  ArrowLeft, Car, Briefcase, MapPin, Navigation, 
  Waves, Utensils, Headphones, Info, ShieldCheck, 
  Clock, PhoneCall, ChevronRight, Sparkles
} from 'lucide-react';

interface ServicesViewProps {
  onBack: () => void;
  onAction?: (action: string) => void;
}

const ServicesView: React.FC<ServicesViewProps> = ({ onBack, onAction }) => {
  const CORE_SERVICES = [
    { 
      id: 'parking', 
      title: '找车位', 
      icon: Car, 
      desc: '实时空位查询', 
      color: 'bg-blue-500', 
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      status: '余位充足'
    },
    { 
      id: 'luggage', 
      title: '行李服务', 
      icon: Briefcase, 
      desc: '寄存与搬运', 
      color: 'bg-orange-500', 
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      status: '正常提供'
    },
    { 
      id: 'entrance', 
      title: '景区入口', 
      icon: MapPin, 
      desc: '一键导航前往', 
      color: 'bg-emerald-500', 
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      status: '快速通行'
    }
  ];

  const GUIDANCE_SERVICES = [
    { id: 'toilet', title: '找厕所', icon: Waves, color: 'text-sky-500' },
    { id: 'restaurant', title: '最近餐厅', icon: Utensils, color: 'text-orange-500' },
    { id: 'audio', title: '景点讲解', icon: Headphones, color: 'text-emerald-500' },
    { id: 'emergency', title: '紧急求助', icon: PhoneCall, color: 'text-rose-500' },
  ];

  const COMMON_INFO = [
    { title: '开放时间', icon: Clock, value: '08:30 - 17:30' },
    { title: '门票政策', icon: Info, value: '查看详情' },
    { title: '入园须知', icon: ShieldCheck, value: '查看详情' },
  ];

  return (
    <div className="absolute inset-0 bg-[#f1f5f2] z-[60] overflow-y-auto no-scrollbar pt-12 pb-32 animate-in fade-in duration-500 scroll-smooth">
      {/* 局部底纹叠加层 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dots-services" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#064e3b" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots-services)" />
        </svg>
      </div>
      <div className="relative z-10">
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm active:scale-90 transition border border-gray-50">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
             <Sparkles size={14} className="text-emerald-600"/>
             <span className="text-xs font-black text-emerald-800 tracking-tight">智能服务中枢</span>
          </div>
        </div>
        <h2 className="text-3xl font-black text-gray-900 leading-tight">
          智慧伴游，<br/>
          <span className="text-emerald-600">服务触手可及</span>
        </h2>
      </div>

      <div className="px-6 space-y-8">
        {/* 景区伴游展示 - 重点突出 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">景区伴游推荐</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">实时状态</span>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {CORE_SERVICES.map((service) => (
              <button 
                key={service.id}
                onClick={() => onAction?.(service.title)}
                className="bg-white rounded-[2.8rem] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white flex items-center justify-between group active:scale-[0.98] transition-all duration-500"
              >
                <div className="flex items-center gap-5">
                  <div className={`relative w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                    <div className={`absolute inset-0 ${service.lightColor} rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500`}></div>
                    <div className={`absolute inset-0 ${service.lightColor} opacity-50 rounded-3xl -rotate-3 group-hover:-rotate-6 transition-transform duration-500`}></div>
                    <service.icon size={28} className={`${service.textColor} relative z-10 stroke-[2.5px]`} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-black text-gray-900 mb-0.5 tracking-tight">{service.title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{service.desc}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1 rounded-full ${service.lightColor} border border-white shadow-sm`}>
                    <span className={`text-[9px] font-black ${service.textColor} tracking-tight`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                    <Navigation size={12} className="group-hover:fill-current" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 智慧导览服务 */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">智慧导览</h3>
          <div className="grid grid-cols-2 gap-4">
            {GUIDANCE_SERVICES.map((item) => (
              <button 
                key={item.id}
                onClick={() => onAction?.(item.title)}
                className="bg-white/60 backdrop-blur-xl p-5 rounded-[2.2rem] border border-white shadow-[0_10px_25px_rgba(0,0,0,0.02)] flex flex-col items-center gap-3 group active:scale-95 transition-all duration-500"
              >
                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm border border-gray-50`}>
                  <item.icon size={22} className={`${item.color} stroke-[2.5px]`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-gray-800 tracking-tight">{item.title}</span>
                  <ChevronRight size={10} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 景区信息流 */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/40 border border-gray-50 mb-10">
          <h3 className="text-xs font-black text-gray-400 mb-6 uppercase tracking-widest px-1">基础信息查询</h3>
          <div className="divide-y divide-gray-50">
            {COMMON_INFO.map((item) => (
              <button 
                key={item.title} 
                className="w-full py-4 flex items-center justify-between active:bg-gray-50 transition px-1 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                    <item.icon size={16} />
                  </div>
                  <span className="text-sm font-black text-gray-700">{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400">{item.value}</span>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ServicesView;
