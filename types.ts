

export enum ViewState {
  HOME = 'HOME',
  MAP = 'MAP',
  NEARBY_CHAT = 'NEARBY_CHAT',
  MALL = 'MALL',
  SERVICES = 'SERVICES',
  PERSONAL_CENTER = 'PERSONAL_CENTER',
  NEARBY_DISCOVERY = 'NEARBY_DISCOVERY',
  COMPLAINT = 'COMPLAINT',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ComplaintRecord {
  id: string;
  type: 'suggestion' | 'complaint';
  content: string;
  status: 'pending' | 'resolved';
  timestamp: number;
}

export enum ComfortLevel {
  COMFORTABLE = '舒适',
  MODERATE = '一般',
  CROWDED = '拥挤',
}

// Added missing Product interface to fix "Module '../types' has no exported member 'Product'" error in MallView.tsx
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}
