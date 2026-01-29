import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Leaf, ArrowRight, CheckCircle2, XCircle, Trophy, RefreshCcw, 
  Activity, Brain, Star, Sparkles, Zap, Cat, Dog, Gamepad2, Map, 
  Cpu, Bot, Home, ChevronLeft, Apple, User, X, GraduationCap, Medal, Calendar,
  Calculator, Globe2, Menu, Users, Image as ImageIcon, Smile,
  Mic, Type, Languages, Volume2, Thermometer, Stethoscope, HeartPulse,
  List, Pencil, Layers, ShoppingBag, Crown, Lock, Unlock,
  Play, Pause, FastForward, Rewind, Music, Bird, Rat, Bug, AlertCircle
} from 'lucide-react';

// --- Helper Functions ---

const playAudio = (text, speed = 1.0, lang = 'en-US') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = speed; 
    utterance.pitch = 1.1; 
    window.speechSynthesis.speak(utterance);
  }
};

// --- Data Structures (Defined BEFORE Levels to avoid undefined errors) ---

const ENGLISH_SUB_MODULES = [
  { id: 'vocab', title: 'Vocab & Sentence', icon: <Type size={24} />, color: 'bg-orange-100 text-orange-600' },
  { id: 'speaking', title: 'Speaking & Reading', icon: <Mic size={24} />, color: 'bg-blue-100 text-blue-600' },
  { id: 'grammar', title: 'Grammar', icon: <Languages size={24} />, color: 'bg-purple-100 text-purple-600' },
  { id: 'phonics', title: 'Phonics', icon: <Volume2 size={24} />, color: 'bg-green-100 text-green-600' },
];

const GRADE_2_SPEAKING_DATA = {
    outdoorSentence: {
        title: "Outdoor Sentence",
        level: "Level 02",
        text: "Small minds discuss people; average minds discuss events; great minds discuss ideas. The future belongs to those who believe in the beauty of their dreams.",
        translation: "心胸狹隘的人議論他人，平庸的人談論事情；心胸開闊的人談論信念。未來屬於那些相信夢想之美的人。"
    },
    listeningGame: {
        title: "What's that noise?",
        intro: "Listen carefully! Who is making that sound?",
        questions: [
            {
                id: 'l1',
                soundText: "Tweet tweet! Tweet tweet! Who's making that tweet? It's not the fish. It must be the bird.",
                correctAnimal: 'bird',
                options: [
                    { id: 'bird', name: 'Bird', icon: <Bird size={40} className="text-blue-500" /> },
                    { id: 'dog', name: 'Dog', icon: <Dog size={40} className="text-orange-500" /> },
                    { id: 'lion', name: 'Lion', icon: <Cat size={40} className="text-yellow-600" /> }
                ]
            },
            {
                id: 'l2',
                soundText: "Woof! Woof! Who's making that bark? It's coming from the park. It looks happy.",
                correctAnimal: 'dog',
                options: [
                    { id: 'mouse', name: 'Mouse', icon: <Rat size={40} className="text-gray-500" /> },
                    { id: 'dog', name: 'Dog', icon: <Dog size={40} className="text-orange-500" /> },
                    { id: 'cat', name: 'Cat', icon: <Cat size={40} className="text-indigo-500" /> }
                ]
            },
            {
                id: 'l3',
                soundText: "Roar! Roar! It sounds big and strong. Is it a kitty? No! It is the king of the jungle.",
                correctAnimal: 'lion',
                options: [
                    { id: 'lion', name: 'Lion', icon: <Cat size={40} className="text-yellow-600" /> },
                    { id: 'bird', name: 'Bird', icon: <Bird size={40} className="text-blue-500" /> },
                    { id: 'bug', name: 'Bug', icon: <Bug size={40} className="text-green-500" /> }
                ]
            }
        ]
    }
};

const GRADE_2_SICKNESS_QUESTIONS = [
  {
    id: 'g2_sick_1',
    type: 'visual_audio', 
    question: "What's wrong with him?",
    visualType: 'headache', 
    options: ["I have a headache.", "I have a stomachache.", "I have a runny nose."],
    correctAnswer: 0,
    correctSentence: "I have a headache.",
    explanation: "Headache (頭痛). The boy is holding his head and it hurts."
  },
  {
    id: 'g2_sick_2',
    type: 'visual_audio',
    question: "Oh no! She needs to go to the bathroom often.",
    visualType: 'diarrhea',
    options: ["She has a sore throat.", "She has a fever.", "She has diarrhea."],
    correctAnswer: 2,
    correctSentence: "She has diarrhea.",
    explanation: "Diarrhea (腹瀉/拉肚子). Stomach pain and needing the toilet."
  },
  {
    id: 'g2_sick_3',
    type: 'visual_audio',
    question: "It hurts when he talks or swallows.",
    visualType: 'sore_throat',
    options: ["He has a broken leg.", "He has a sore throat.", "He has a toothache."],
    correctAnswer: 1,
    correctSentence: "He has a sore throat.",
    explanation: "Sore throat (喉嚨痛). The throat is red and painful."
  }
];

// Ensure this data exists BEFORE assigning to Level P
const GRAMMAR_LEVEL_2_UNITS = [
    {
        id: 'unit_8',
        title: 'Unit 8: Possessive Nouns',
        subTitle: 'You are not alone',
        description: "Learn about 's and s' (Singular & Plural)",
        questions: [
            { id: 'u8_q1', question: "Circle the correct one: \nMy _______ name is Leo. (Single brother)", options: ["brother's", "brothers'", "brother"], correctAnswer: 0, correctSentence: "My brother's name is Leo.", explanation: "單數名詞的所有格直接加 's (brother -> brother's)。" },
            { id: 'u8_q2', question: "Choose the correct sentence:", options: ["These are those dogs' bowls.", "These are those dog's bowls.", "These are those dogs's bowls."], correctAnswer: 0, correctSentence: "These are those dogs' bowls.", explanation: "Dogs 是複數且字尾有 s，所有格直接加 ' (dogs -> dogs')。" },
            { id: 'u8_q3', question: "Correct the sentence: \n'It's Linda pencil sharpener.'", options: ["It's Linda's pencil sharpener.", "It's Lindas pencil sharpener.", "It's Lindas' pencil sharpener."], correctAnswer: 0, correctSentence: "It's Linda's pencil sharpener.", explanation: "Linda 是名字（單數），表示「Linda 的」要用 Linda's。" },
            { id: 'u8_q4', question: "What is the possessive form of 'Mr. White'?", options: ["Mr. Whites'", "Mr. White's", "Mr. Whites"], correctAnswer: 1, correctSentence: "Mr. White's students are very good.", explanation: "Mr. White 是單數專有名詞，所有格為 Mr. White's。" }
        ]
    },
    {
        id: 'unit_9',
        title: 'Unit 9: Words end in -s',
        subTitle: 'David! You are precious',
        description: "Plural vs Possessive vs Verb vs Contraction",
        questions: [
            { id: 'u9_q1', question: "Identify the type of word in red: \n'Leo's father is brave.'", options: ["Possessive Noun (所有格)", "Contraction (縮寫 is)", "Plural Noun (複數)", "3rd Person Verb (動詞)"], correctAnswer: 0, correctSentence: "Leo's father is brave.", explanation: "Leo's father 意指「Leo 的爸爸」，故為所有格 (Possessive Noun)。" },
            { id: 'u9_q2', question: "Identify the type of word in red: \n'Jason wants some sugar.'", options: ["Possessive Noun", "Contraction", "Plural Noun", "3rd Person Singular Verb"], correctAnswer: 3, correctSentence: "Jason wants some sugar.", explanation: "Jason 是第三人稱單數，動詞 want 要加 s (wants)。" },
            { id: 'u9_q3', question: "Identify the type of word in red: \n'It's her umbrella.'", options: ["Possessive Noun", "Contraction (It is)", "Plural Noun", "Verb"], correctAnswer: 1, correctSentence: "It's her umbrella.", explanation: "It's = It is (它是)，這是縮寫 (Contraction)。" },
            { id: 'u9_q4', question: "Identify the type of word in red: \n'Those are comic books.'", options: ["Possessive Noun", "Contraction", "Plural Noun", "Verb"], correctAnswer: 2, correctSentence: "Those are comic books.", explanation: "Books 表示很多本書，是名詞複數 (Plural Noun)。" }
        ]
    },
    {
        id: 'unit_10',
        title: 'Unit 10: "Th" words',
        subTitle: "We're there for each other",
        description: "This/That/These/Those & There/They",
        questions: [
            { id: 'u10_q1', question: "______ monkey is strong. (The monkey is right here)", options: ["This", "That", "These", "Those"], correctAnswer: 0, correctSentence: "This monkey is strong.", explanation: "單數且距離近 (right here)，使用 This。" },
            { id: 'u10_q2', question: "______ strawberries are red. (The strawberries are over there)", options: ["This", "That", "These", "Those"], correctAnswer: 3, correctSentence: "Those strawberries are red.", explanation: "複數且距離遠 (over there)，使用 Those。" },
            { id: 'u10_q3', question: "Select the correct word: \n'______ are five dogs in Joe's house.'", options: ["They", "There", "Their", "This"], correctAnswer: 1, correctSentence: "There are five dogs in Joe's house.", explanation: "表示「有...」的句型使用 There are。" },
            { id: 'u10_q4', question: "Find the mistake and correct it: \n'This students are in the classroom.'", options: ["'This' should be 'These'", "'are' should be 'is'", "'students' should be 'student'", "No mistake"], correctAnswer: 0, correctSentence: "These students are in the classroom.", explanation: "Students 是複數，且 are 是複數動詞，指示代名詞應用 These (或 Those)。" }
        ]
    },
    {
        id: 'review_1',
        title: 'Level 2 Review',
        subTitle: 'Units 8-10 Challenge',
        description: "Final check for Level 2 Grammar!",
        questions: [
            { id: 'rev_1', question: "My sisters' names ______ Elsa and Anna.", options: ["is", "are", "am", "be"], correctAnswer: 1, correctSentence: "My sisters' names are Elsa and Anna.", explanation: "Subject is 'names' (plural), so use 'are'." },
            { id: 'rev_2', question: "The ______ ears are big. (Many monkeys)", options: ["monkey's", "monkeys", "monkeys'", "monkey"], correctAnswer: 2, correctSentence: "The monkeys' ears are big.", explanation: "Plural monkeys ending in s -> monkeys'." },
            { id: 'rev_3', question: "______ my best friend.", options: ["She's", "Shes", "She", "Hers"], correctAnswer: 0, correctSentence: "She's my best friend.", explanation: "She's = She is." },
            { id: 'rev_4', question: "Who are ______ girls? (Over there)", options: ["this", "that", "these", "those"], correctAnswer: 3, correctSentence: "Who are those girls?", explanation: "Plural and far away -> Those." }
        ]
    }
];

// English Levels Configuration
// IMPORTANT: Grammar data is only in lvl_p (Grade 2) as requested.
const ENGLISH_LEVELS = [
  {
    id: 'lvl_a', grade: 'Grade 1', code: 'Level A', theme: 'illustration', title: 'Phonics Fun',
    icon: <Cat className="w-8 h-8" />, color: 'bg-yellow-100 text-yellow-700', gradient: 'from-yellow-300 to-orange-400', shadow: 'shadow-orange-200', borderColor: 'border-orange-500',
    modules: { vocab: [{ id: 'a1_v1', question: "What is this?", options: ["Apple", "Cat", "Ball"], correctAnswer: 0, explanation: "Red Apple." }], speaking: null, grammar: [], phonics: [] }
  },
  {
    id: 'lvl_p', grade: 'Grade 2', code: 'Level P', theme: 'illustration', title: 'Daily Words',
    icon: <Dog className="w-8 h-8" />, color: 'bg-pink-100 text-pink-700', gradient: 'from-pink-300 to-rose-400', shadow: 'shadow-rose-200', borderColor: 'border-rose-500',
    modules: {
      vocab: GRADE_2_SICKNESS_QUESTIONS,
      speaking: GRADE_2_SPEAKING_DATA,
      grammar: GRAMMAR_LEVEL_2_UNITS, // Ensure this matches variable above
      phonics: []
    }
  },
  { id: 'lvl_l', grade: 'Grade 3', code: 'Level L', theme: 'pixel', title: 'Forest Adventure', icon: <Map className="w-8 h-8" />, color: 'bg-green-100 text-green-700', gradient: 'from-green-400 to-emerald-600', shadow: 'shadow-emerald-200', borderColor: 'border-emerald-700', modules: { vocab: [], speaking: null, grammar: [], phonics: [] } },
  { id: 'lvl_u', grade: 'Grade 4', code: 'Level U', theme: 'pixel', title: 'Dungeon Quest', icon: <Gamepad2 className="w-8 h-8" />, color: 'bg-blue-100 text-blue-700', gradient: 'from-cyan-400 to-blue-500', shadow: 'shadow-blue-200', borderColor: 'border-blue-700', modules: { vocab: [], speaking: null, grammar: [], phonics: [] } },
  { id: 'lvl_s', grade: 'Grade 5', code: 'Level S', theme: 'tech', title: 'Cyber City', icon: <Cpu className="w-8 h-8" />, color: 'bg-indigo-100 text-indigo-700', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-purple-200', borderColor: 'border-purple-800', modules: { vocab: [], speaking: null, grammar: [], phonics: [] } },
  { id: 'lvl_j', grade: 'Grade 6', code: 'Level J', theme: 'tech', title: 'Future AI', icon: <Bot className="w-8 h-8" />, color: 'bg-slate-100 text-slate-700', gradient: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-400', borderColor: 'border-slate-950', modules: { vocab: [], speaking: null, grammar: [], phonics: [] } }
];

const MAIN_SUBJECTS = [
  { id: 'english_hub', title: '英語冒險島', subTitle: 'English Adventure', type: 'menu', icon: <BookOpen className="w-10 h-10 text-white drop-shadow-md" />, gradient: 'from-orange-400 via-amber-400 to-yellow-400', shadow: 'shadow-orange-200/50', borderColor: 'border-orange-600', levels: ENGLISH_LEVELS },
  { id: 'biology', title: '自然探索', subTitle: 'Biology Lab', type: 'direct', icon: <Leaf className="w-10 h-10 text-white drop-shadow-md" />, gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200/50', borderColor: 'border-emerald-600', questions: [{ id: 1, question: "在校園生態池中，我們發現了青蛙的幼體「蝌蚪」。請問蝌蚪主要使用什麼器官在水中呼吸？", options: ["肺 (Lungs)", "鰓 (Gills)", "皮膚 (Skin)", "氣管 (Trachea)"], correctAnswer: 1, explanation: "蝌蚪在水中生活時，主要依靠「鰓」來過濾水中的氧氣。" }] },
  { id: 'math_whiz', title: '數學金頭腦', subTitle: 'Math Whiz', type: 'direct', icon: <Calculator className="w-10 h-10 text-white drop-shadow-md" />, gradient: 'from-violet-500 to-indigo-600', shadow: 'shadow-indigo-200/50', borderColor: 'border-indigo-700', questions: [{ id: 'm1', question: "小明買了 3 顆蘋果，每顆 15 元，他付給老闆 100 元，請問應該找回多少錢？", options: ["45 元", "55 元", "65 元", "35 元"], correctAnswer: 1, explanation: "3 x 15 = 45 (蘋果總價)，100 - 45 = 55 (找回的錢)。" }] },
  { id: 'social_studies', title: '社會探險家', subTitle: 'World Explorer', type: 'direct', icon: <Globe2 className="w-10 h-10 text-white drop-shadow-md" />, gradient: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-200/50', borderColor: 'border-rose-600', questions: [{ id: 's1', question: "台灣有很多原住民族群，請問「豐年祭」主要是哪一個族群的傳統祭典？", options: ["泰雅族 (Atayal)", "排灣族 (Paiwan)", "阿美族 (Amis)", "布農族 (Bunun)"], correctAnswer: 2, explanation: "豐年祭是阿美族 (Amis) 最重要的年度祭典，感謝神靈賜予豐收。" }] }
];

const SHOP_ITEMS = [
    { id: 'stick_1', name: 'Happy Panda', type: 'sticker', price: 100, icon: '🐼' },
    { id: 'stick_2', name: 'Cool Monkey', type: 'sticker', price: 150, icon: '🐵' },
    { id: 'stick_3', name: 'Super Star', type: 'sticker', price: 200, icon: '⭐' },
    { id: 'gif_1', name: 'Dancing Cat', type: 'gif', price: 500, icon: '🐱', isGif: true },
    { id: 'gif_2', name: 'Rocket Launch', type: 'gif', price: 600, icon: '🚀', isGif: true },
    { id: 'gif_3', name: 'Party Popper', type: 'gif', price: 500, icon: '🎉', isGif: true },
];

const LEADERBOARD_MOCK = [
    { rank: 1, name: 'Emma Watson', id: 'S-102', points: 12500, avatar: 'Emma' },
    { rank: 2, name: 'Liam Neeson', id: 'S-205', points: 11800, avatar: 'Liam' },
    { rank: 3, name: 'Sophie Turner', id: 'S-331', points: 11250, avatar: 'Sophie' },
    { rank: 4, name: 'Alex Chen', id: 'S-888', points: 2500, avatar: 'Alex', isUser: true }, 
    { rank: 5, name: 'Noah Centineo', id: 'S-404', points: 9800, avatar: 'Noah' },
    { rank: 6, name: 'Millie Brown', id: 'S-555', points: 9500, avatar: 'Millie' },
];

// --- Components ---

const SicknessAnimation = ({ type }) => {
  if (type === 'headache') return (<div className="flex flex-col items-center justify-center py-8"><div className="relative"><div className="w-24 h-24 bg-yellow-100 rounded-full border-4 border-gray-800 flex items-center justify-center animate-[shake_0.5s_ease-in-out_infinite]"><div className="flex gap-4"><div className="w-2 h-2 bg-gray-800 rounded-full"></div><div className="w-2 h-2 bg-gray-800 rounded-full"></div></div><div className="absolute bottom-6 w-8 h-4 border-t-4 border-gray-800 rounded-t-full"></div><div className="absolute -top-4 -right-2 text-red-500 animate-pulse"><Zap size={32} fill="currentColor" /></div></div></div><p className="mt-4 text-gray-400 font-bold text-sm">Animation: Head Shaking</p></div>);
  if (type === 'diarrhea') return (<div className="flex flex-col items-center justify-center py-8"><div className="relative"><div className="w-24 h-32 bg-blue-100 rounded-[2rem] border-4 border-gray-800 flex flex-col items-center pt-6 animate-pulse"><div className="w-16 h-16 bg-white/50 rounded-full border-2 border-gray-300 flex items-center justify-center"><div className="animate-[spin_3s_linear_infinite] text-orange-400"><Activity size={32} /></div></div></div><div className="absolute -right-4 top-10 text-red-500 font-bold text-xl animate-bounce">?!</div></div><p className="mt-4 text-gray-400 font-bold text-sm">Animation: Stomach Rumbling</p></div>);
  if (type === 'sore_throat') return (<div className="flex flex-col items-center justify-center py-8"><div className="relative"><div className="w-24 h-24 bg-pink-100 rounded-full border-4 border-gray-800 flex items-center justify-center"><div className="flex gap-4 mb-2"><div className="w-2 h-2 bg-gray-800 rounded-full"></div><div className="w-2 h-2 bg-gray-800 rounded-full"></div></div><div className="absolute bottom-4 w-6 h-6 bg-red-400 rounded-full animate-pulse border-2 border-red-600 opacity-80 shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div></div><Thermometer className="absolute -right-2 top-0 text-red-500" size={32} /></div><p className="mt-4 text-gray-400 font-bold text-sm">Animation: Red Throat</p></div>);
  return null;
};

const Header = ({ points = 2500, onHomeClick, onMenuClick, onProfileClick }) => (
  <header className="w-full max-w-6xl mx-auto mb-8 flex items-center justify-between px-4 md:px-0 pt-4">
    <div className="min-w-[200px]">
        <button onClick={onHomeClick} className="group bg-white rounded-2xl p-2 pr-5 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-left">
          <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
             <div className="absolute inset-0 bg-green-100 rounded-xl rotate-6"></div>
             <div className="absolute inset-0 bg-red-50 rounded-xl -rotate-3"></div>
             <Apple className="relative z-10 w-8 h-8 text-red-500 fill-red-500 drop-shadow-sm" />
             <Leaf className="absolute -top-1 -right-1 w-4 h-4 text-green-500 fill-green-500 z-20" />
          </div>
          <div><span className="block text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-red-400 transition-colors">Experimental</span><span className="font-black text-gray-800 tracking-tight text-lg leading-none">Edu Platform</span></div>
        </button>
    </div>
    <div className="flex items-center justify-end gap-3 min-w-[200px]">
        <div onClick={onProfileClick} className="flex items-center gap-3 bg-white pl-2 pr-2 py-2 rounded-full shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group select-none">
          <div className="bg-yellow-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-yellow-100"><Star className="text-yellow-400 fill-yellow-400 w-4 h-4" /><span className="font-black text-yellow-600 text-sm">{points.toLocaleString()}</span></div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2 pr-2">
            <div className="text-right hidden sm:block"><div className="text-xs font-bold text-gray-400">ID: S-888</div><div className="text-sm font-black text-gray-700 leading-none">Alex Chen</div></div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 p-0.5 shadow-inner relative overflow-hidden">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede" alt="User" className="w-full h-full object-cover"/></div>
            </div>
          </div>
        </div>
        <button onClick={onMenuClick} className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 active:scale-95 transition-all"><Menu size={24} /></button>
    </div>
  </header>
);

const DropdownMenu = ({ onClose, onNavigate }) => (
    <div className="absolute top-24 right-4 md:right-[calc(50%-32rem+1rem)] z-40 w-64 bg-white rounded-2xl shadow-xl border-2 border-gray-100 animate-slide-up origin-top-right overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Social Hub</h4>
            <div className="flex items-center gap-2 mb-1">
                <div className="flex -space-x-2">{[1,2,3].map(i => (<div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Friend${i}&backgroundColor=b6e3f4`} className="w-full h-full" alt="friend"/></div>))}</div>
                <span className="text-xs font-bold text-green-600">+3 Online</span>
            </div>
        </div>
        <div className="p-2">
            <button onClick={() => onNavigate('leaderboard')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors text-left font-bold"><div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Crown size={18} /></div><span>Top 50 Scholars</span></button>
            <button onClick={() => onNavigate('shop')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-colors text-left font-bold"><div className="bg-pink-100 p-2 rounded-lg text-pink-600"><ShoppingBag size={18} /></div><span>Gift Shop</span></button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 transition-colors text-left font-bold"><div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Smile size={18} /></div><span>My Stickers</span></button>
        </div>
    </div>
);

const UserProfileModal = ({ onClose, userPoints }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"><X size={20} /></button>
            </div>
            <div className="px-8 pb-8 relative">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                    <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl bg-white overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede" alt="User" className="w-full h-full object-cover"/></div>
                    <div className="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">ONLINE</div>
                </div>
                <div className="mt-20 text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-800">Alex Chen</h2>
                    <p className="text-gray-400 font-bold text-sm mb-4">Student ID: S-888</p>
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-bold text-sm border border-blue-100"><GraduationCap size={16} /> Grade 4 - Class A</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center"><div className="bg-yellow-100 p-2 rounded-full mb-2"><Star className="w-5 h-5 text-yellow-600" /></div><span className="text-2xl font-black text-gray-800">{userPoints}</span><span className="text-xs font-bold text-gray-400 uppercase">Points</span></div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center"><div className="bg-emerald-100 p-2 rounded-full mb-2"><Calendar className="w-5 h-5 text-emerald-600" /></div><span className="text-2xl font-black text-gray-800">5</span><span className="text-xs font-bold text-gray-400 uppercase">Day Streak</span></div>
                </div>
                <button onClick={onClose} className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors active:scale-95">Close Profile</button>
            </div>
        </div>
    </div>
);

const GameButton = ({ children, onClick, className = "", variant = "primary", disabled = false }) => {
    const variants = {
        primary: "bg-blue-500 border-blue-700 text-white hover:bg-blue-400 active:border-b-0 active:translate-y-[4px]",
        neutral: "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 active:border-b-0 active:translate-y-[4px]",
        action: "bg-orange-500 border-orange-700 text-white hover:bg-orange-400 active:border-b-0 active:translate-y-[4px]",
        option: "bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 active:border-b-0 active:translate-y-[4px]",
        danger: "bg-red-500 border-red-700 text-white hover:bg-red-400 active:border-b-0 active:translate-y-[4px]",
        success: "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400 active:border-b-0 active:translate-y-[4px]",
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`relative transition-all duration-100 border-b-[4px] rounded-2xl font-bold flex items-center justify-center gap-2 ${variants[variant] || variants.primary} ${className} ${disabled ? 'opacity-50 cursor-not-allowed active:translate-y-0 active:border-b-[4px]' : ''}`}>
            {children}
        </button>
    );
};

const ProgressBar = ({ current, total, colorClass }) => (
  <div className="w-full bg-gray-200 rounded-full h-4 mb-8 border-4 border-white shadow-sm">
    <div className={`h-full rounded-full transition-all duration-500 ${colorClass} relative`} style={{ width: `${((current + 1) / total) * 100}%` }}>
        <div className="absolute top-0 right-0 bottom-0 w-full bg-white/20 animate-pulse rounded-full"></div>
    </div>
  </div>
);

// --- Speaking Views ---

const OutdoorSentenceView = ({ data, onFinish }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);

    const handleRecord = () => {
        setIsRecording(true);
        setTimeout(() => setIsRecording(false), 3000); 
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 pb-20 animate-slide-up">
             <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden relative p-8">
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-6 py-2 rounded-bl-3xl font-black text-sm uppercase tracking-wider">{data.level}</div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Leaf size={24} /></div>
                    <div><h2 className="text-2xl font-black text-gray-800">{data.title}</h2><p className="text-gray-400 font-bold text-sm">Read aloud with confidence!</p></div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8 border border-blue-100 relative shadow-inner min-h-[200px] flex items-center justify-center text-center">
                    <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed font-serif">"{data.text}"</p>
                    {showTranslation && (<div className="absolute bottom-4 left-0 right-0 text-center animate-fade-in"><p className="text-gray-500 font-medium text-sm bg-white/80 inline-block px-4 py-1 rounded-full">{data.translation}</p></div>)}
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2">1. Listen & Learn</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[{emoji:'🐢', label:'Slow', speed:0.7}, {emoji:'🙂', label:'Normal', speed:1.0}, {emoji:'🐇', label:'Fast', speed:1.2}].map(item => (
                                <button key={item.label} onClick={() => playAudio(data.text, item.speed)} className="flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 border-2 border-gray-100 hover:border-blue-300 rounded-xl p-3 transition-all active:scale-95 group">
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.emoji}</span><span className="text-xs font-bold text-gray-500">{item.label}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowTranslation(!showTranslation)} className="w-full py-2 text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors">{showTranslation ? "Hide Meaning" : "Show Meaning"}</button>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2">2. Your Turn</h3>
                        <button onClick={handleRecord} disabled={isRecording} className={`w-full h-24 rounded-2xl flex items-center justify-center gap-3 transition-all ${isRecording ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-800 text-white shadow-lg hover:bg-gray-700 active:translate-y-1'}`}>
                            {isRecording ? (<><div className="flex gap-1 items-center"><div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div><div className="w-2 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div><div className="w-2 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div></div><span className="font-bold text-red-500">Recording...</span></>) : (<><Mic size={28} /><span className="font-bold text-lg">Tap to Record</span></>)}
                        </button>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end"><GameButton onClick={onFinish} variant="action" className="px-8 py-3">Practice Next Mission <ArrowRight size={18} /></GameButton></div>
             </div>
        </div>
    );
};

const ListeningGameView = ({ data, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const question = data.questions[currentIndex];
    const isLast = currentIndex === data.questions.length - 1;

    const handlePlaySound = () => {
        setIsPlaying(true);
        playAudio(question.soundText);
        setTimeout(() => setIsPlaying(false), 4000); 
    };

    const handleGuess = (animalId) => {
        if (showAnswer) return;
        const correct = animalId === question.correctAnimal;
        setIsCorrect(correct);
        setShowAnswer(true);
        playAudio(correct ? "Correct! Good job!" : "Try again!");
    };

    const nextQ = () => {
        if (!isLast) { setCurrentIndex(prev => prev + 1); setShowAnswer(false); setIsCorrect(null); } 
        else { onBack(); }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 pb-20 animate-slide-up">
            <div className="flex items-center gap-4 mb-8">
                 <GameButton variant="neutral" onClick={onBack} className="px-4 py-3"><ChevronLeft size={24} /></GameButton>
                 <div><h2 className="text-3xl font-black text-gray-800">{data.title}</h2><p className="text-gray-500 font-bold">{data.intro}</p></div>
            </div>
            <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden p-8">
                <div className="bg-orange-50 rounded-3xl p-8 mb-8 border-2 border-orange-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-orange-200"></div>
                    <button onClick={handlePlaySound} className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all mb-4 ${isPlaying ? 'bg-orange-400 scale-110' : 'bg-orange-500 hover:bg-orange-400 hover:-translate-y-1'}`}>
                        {isPlaying ? <Volume2 size={40} className="text-white animate-pulse" /> : <Play size={40} className="text-white ml-2" />}
                    </button>
                    <p className="font-bold text-orange-800 text-lg">Tap to Listen</p>
                    <p className="text-orange-600/60 text-sm">Question {currentIndex + 1} of {data.questions.length}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {question.options.map((opt) => {
                        let cardStyle = "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                        if (showAnswer) { if (opt.id === question.correctAnimal) cardStyle = "bg-green-100 border-green-400 ring-2 ring-green-200 scale-105"; else cardStyle = "opacity-50 grayscale"; }
                        return (
                            <button key={opt.id} onClick={() => handleGuess(opt.id)} disabled={showAnswer} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-b-4 transition-all duration-300 active:scale-95 ${cardStyle}`}>
                                <div className="mb-2 transform transition-transform">{opt.icon}</div><span className="font-bold text-gray-700">{opt.name}</span>
                            </button>
                        );
                    })}
                </div>
                {showAnswer && (
                    <div className="mt-8 animate-fade-in bg-slate-50 rounded-2xl p-6 flex items-center justify-between border border-slate-100">
                        <div className="flex items-center gap-3">
                            {isCorrect ? <CheckCircle2 className="text-green-500 w-8 h-8" /> : <XCircle className="text-red-500 w-8 h-8" />}
                            <div><h4 className={`font-black text-lg ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>{isCorrect ? "That's right!" : "Oops!"}</h4><p className="text-gray-500 text-sm font-bold">It was the {question.correctAnimal}!</p></div>
                        </div>
                        <GameButton onClick={nextQ} variant="primary" className="px-6 py-2">{isLast ? "Finish" : "Next"} <ArrowRight size={18} /></GameButton>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState('home'); 
  const [activeSubject, setActiveSubject] = useState(null); 
  const [activeLevel, setActiveLevel] = useState(null); 
  const [activeModuleId, setActiveModuleId] = useState(null); 
  const [activeUnit, setActiveUnit] = useState(null);
  const [activeSpeakingMode, setActiveSpeakingMode] = useState('menu');

  const [points, setPoints] = useState(2500); 
  const [ownedItems, setOwnedItems] = useState([]); 
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const getQuestions = () => {
    if (activeUnit) return activeUnit.questions || [];
    if (activeLevel && activeModuleId && activeModuleId !== 'grammar' && activeModuleId !== 'speaking') return activeLevel.modules[activeModuleId] || [];
    if (activeSubject && !activeSubject.levels) return activeSubject.questions || [];
    return [];
  };
  const currentQuestions = getQuestions();

  const handleHomeClick = () => { setView('home'); setActiveSubject(null); setActiveLevel(null); setActiveModuleId(null); setActiveUnit(null); setShowMenu(false); };
  const handleMenuClick = () => setShowMenu(!showMenu);
  const handleNavigate = (targetView) => { setShowMenu(false); setView(targetView); };

  const handleSubjectClick = (subject) => { setActiveSubject(subject); subject.type === 'menu' ? setView('levels') : startQuiz(subject.questions); };
  const handleLevelClick = (level) => { setActiveLevel(level); setView('english_menu'); };
  
  const handleEnglishModuleClick = (moduleId) => {
    setActiveModuleId(moduleId);
    if (moduleId === 'grammar') { setView('grammar_units'); }
    else if (moduleId === 'speaking') { 
        if (activeLevel.modules.speaking) { setView('speaking_hub'); setActiveSpeakingMode('menu'); } 
        else { alert("Coming soon!"); }
    } else {
        const questions = activeLevel.modules[moduleId] || [];
        questions.length === 0 ? startQuiz([{ id: 'mock', question: `[${moduleId}] Content coming soon!`, options: ["OK"], correctAnswer: 0, explanation: "Under construction." }]) : startQuiz(questions);
    }
  };

  const handleGrammarUnitClick = (unit) => { setActiveUnit(unit); startQuiz(unit.questions); };

  const startQuiz = (questions) => { setCurrentQuestionIndex(0); setScore(0); setShowExplanation(false); setSelectedOption(null); setView('quiz'); };

  const handleOptionClick = (index, optionText) => {
    if (showExplanation) return;
    const currentQ = currentQuestions[currentQuestionIndex];
    if (currentQ.correctSentence) playAudio(currentQ.correctSentence);
    else playAudio(optionText);

    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQuestions[currentQuestionIndex].correctAnswer) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) { setCurrentQuestionIndex(prev => prev + 1); setShowExplanation(false); setSelectedOption(null); } 
    else { setView('result'); }
  };

  const handleCollectPoints = () => {
      const earnedPoints = score * 10 + (score === currentQuestions.length ? 50 : 0);
      setPoints(prev => prev + earnedPoints);
      if (activeUnit) setView('grammar_units');
      else if (activeLevel) setView('english_menu');
      else setView('home');
  };

  const handleBuyItem = (item) => {
      if (points >= item.price && !ownedItems.includes(item.id)) { setPoints(prev => prev - item.price); setOwnedItems(prev => [...prev, item.id]); }
  };

  // --- Render Functions (Previous & New) ---

  const renderHome = () => (
    <div className="w-full max-w-6xl mx-auto px-4 animate-fade-in pb-20">
      <div className="text-center mb-10"><h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-3 tracking-tight">Hello, Alex!</h1><p className="text-gray-500 font-bold text-lg">今天想挑戰哪個冒險？</p></div>
      <div className="grid md:grid-cols-2 gap-6">
        {MAIN_SUBJECTS.map((sub) => (
          <div key={sub.id} onClick={() => handleSubjectClick(sub)} className={`group relative overflow-hidden rounded-[2.5rem] p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br ${sub.gradient} border-b-[8px] ${sub.borderColor}`}>
            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4"><Sparkles className="w-32 h-32 text-white" /></div>
            <div className="relative z-10 flex flex-col h-full items-center text-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-3xl mb-4 shadow-inner border border-white/30">{sub.icon}</div>
              <h3 className="text-3xl font-black text-white mb-2 drop-shadow-sm">{sub.title}</h3>
              <p className="text-white/90 font-bold mb-8 text-lg">{sub.subTitle}</p>
              <div className="bg-white text-gray-800 px-8 py-3 rounded-2xl font-black shadow-lg transform transition-transform group-hover:scale-105 active:scale-95 flex items-center gap-2"><Zap className={`w-5 h-5 text-gray-800`} fill="currentColor" /> Start Now!</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLevels = () => (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <GameButton variant="neutral" onClick={() => setView('home')} className="px-4 py-3"><ChevronLeft size={24} /></GameButton>
        <div><h2 className="text-3xl font-black text-gray-800">English Levels</h2><p className="text-gray-500 font-bold">Choose your adventure grade!</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ENGLISH_LEVELS.map((level) => (
            <div key={level.id} onClick={() => handleLevelClick(level)} className={`relative p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] overflow-hidden group bg-gradient-to-br ${level.gradient} ${level.borderColor ? 'border-b-[6px] ' + level.borderColor + ' rounded-[2rem]' : ''}`}>
                 <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1"><h3 className="text-2xl font-black text-white drop-shadow-md">{level.title}</h3><span className="bg-white/20 px-2 py-1 rounded text-xs font-bold text-white">{level.grade}</span></div>
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">{level.icon}</div>
                 </div>
            </div>
        ))}
      </div>
    </div>
  );

  const renderEnglishMenu = () => (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <GameButton variant="neutral" onClick={() => setView('levels')} className="px-4 py-3"><ChevronLeft size={24} /></GameButton>
        <div><h2 className="text-3xl font-black text-gray-800">{activeLevel.code} Challenge</h2><p className="text-gray-500 font-bold">What skill do you want to practice?</p></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
         {ENGLISH_SUB_MODULES.map((mod) => (
             <button key={mod.id} onClick={() => handleEnglishModuleClick(mod.id)} className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border-4 border-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 ${mod.color} bg-white`}>
                <div className="w-16 h-16 rounded-2xl bg-white/50 mb-4 flex items-center justify-center shadow-inner">{mod.icon}</div>
                <span className="font-black text-lg text-center">{mod.title}</span><span className="text-xs font-bold opacity-60 mt-1 uppercase">Start</span>
             </button>
         ))}
      </div>
    </div>
  );

  const renderGrammarUnits = () => {
    const units = activeLevel.modules.grammar || [];
    return (
      <div className="w-full max-w-3xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-4 mb-8">
            <GameButton variant="neutral" onClick={() => setView('english_menu')} className="px-4 py-3"><ChevronLeft size={24} /></GameButton>
            <div><h2 className="text-3xl font-black text-gray-800">Grammar Lab</h2><p className="text-gray-500 font-bold">{activeLevel.grade} - Core Concepts</p></div>
        </div>
        {units.length > 0 ? (
            <div className="space-y-4">
                {units.map((unit) => (
                    <div key={unit.id} onClick={() => handleGrammarUnitClick(unit)} className={`bg-white rounded-2xl p-6 shadow-md border-b-4 border-gray-100 cursor-pointer transition-all hover:border-purple-200 hover:bg-purple-50 group flex items-center gap-4`}>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">{unit.id.includes('review') ? <Medal size={24} /> : <Pencil size={24} />}</div>
                        <div className="flex-1"><h3 className="font-black text-xl text-gray-800 group-hover:text-purple-700">{unit.title}</h3><p className="text-sm font-bold text-gray-400 mb-1">{unit.subTitle}</p><p className="text-xs text-gray-500">{unit.description}</p></div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-500 group-hover:text-white transition-all"><ArrowRight size={16} /></div>
                    </div>
                ))}
            </div>
        ) : (<div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200"><Layers className="mx-auto text-gray-300 w-16 h-16 mb-4" /><h3 className="text-xl font-bold text-gray-400">No grammar units yet</h3><p className="text-gray-400 text-sm mt-2">Try Grade 2 (Level P) for grammar!</p></div>)}
      </div>
    );
  };

  const renderShop = () => (
      <div className="w-full max-w-4xl mx-auto px-4 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <GameButton variant="neutral" onClick={() => setView('home')} className="px-4 py-3"><ChevronLeft size={24} /></GameButton>
            <div><h2 className="text-3xl font-black text-gray-800">Gift Shop</h2><p className="text-gray-500 font-bold">Spend your stars!</p></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {SHOP_ITEMS.map((item) => {
                  const isOwned = ownedItems.includes(item.id);
                  const canAfford = points >= item.price;
                  return (
                      <div key={item.id} className={`bg-white rounded-3xl p-6 border-b-8 ${isOwned ? 'border-green-200' : 'border-gray-200'} flex flex-col items-center relative overflow-hidden`}>
                          <div className="text-6xl mb-4 transform hover:scale-110 transition-transform cursor-default">{item.icon}</div>
                          <h3 className="font-bold text-gray-700 mb-2">{item.name}</h3>
                          {isOwned ? (<div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-black text-sm w-full text-center">OWNED</div>) : (<button onClick={() => handleBuyItem(item)} disabled={!canAfford} className={`w-full py-2 rounded-xl font-black text-sm flex items-center justify-center gap-1 transition-all active:scale-95 ${canAfford ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}><Star size={14} fill="currentColor" /> {item.price}</button>)}
                      </div>
                  )
              })}
          </div>
      </div>
  );

  const renderLeaderboard = () => (
      <div className="w-full max-w-2xl mx-auto px-4 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <GameButton variant="neutral" onClick={() => setView('home')} className="px-4 py-3"><ChevronLeft size={24} /></GameButton>
            <div><h2 className="text-3xl font-black text-gray-800">Top 50 Scholars</h2><p className="text-gray-500 font-bold">Who is learning the most?</p></div>
          </div>
          <div className="bg-white rounded-[2rem] shadow-xl border-4 border-blue-50 overflow-hidden">
              {LEADERBOARD_MOCK.map((user, idx) => {
                  const displayPoints = user.isUser ? points : user.points;
                  return (
                    <div key={user.id} className={`p-4 flex items-center gap-4 border-b border-gray-100 ${user.isUser ? 'bg-yellow-50/50' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${idx < 3 ? 'bg-yellow-400 text-white shadow-md' : 'text-gray-400 bg-gray-100'}`}>{idx + 1}</div>
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}&backgroundColor=c0aede`} alt="User" className="w-full h-full object-cover"/></div>
                        <div className="flex-1"><h4 className={`font-bold ${user.isUser ? 'text-blue-600' : 'text-gray-700'}`}>{user.name} {user.isUser && '(You)'}</h4><p className="text-xs text-gray-400 font-bold">ID: {user.id}</p></div>
                        <div className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-black text-sm flex items-center gap-1"><Star size={12} fill="currentColor" /> {displayPoints.toLocaleString()}</div>
                    </div>
                  );
              })}
              <div className="p-4 text-center text-gray-400 font-bold text-sm bg-gray-50">... and 44 more students</div>
          </div>
      </div>
  );

  const renderSpeakingHub = () => {
    const data = activeLevel.modules.speaking;
    if (activeSpeakingMode === 'outdoor') return <OutdoorSentenceView data={data.outdoorSentence} onFinish={() => setActiveSpeakingMode('menu')} />;
    if (activeSpeakingMode === 'game') return <ListeningGameView data={data.listeningGame} onBack={() => setActiveSpeakingMode('menu')} />;
    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-20">
             <div className="flex items-center gap-4 mb-8">
                <GameButton variant="neutral" onClick={() => setView('english_menu')} className="px-4 py-3"><ChevronLeft size={24} /></GameButton>
                <div><h2 className="text-3xl font-black text-gray-800">Speaking Lab</h2><p className="text-gray-500 font-bold">Voice & Listening Practice</p></div>
            </div>
            <div className="space-y-6">
                <div onClick={() => setActiveSpeakingMode('outdoor')} className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-[2rem] p-8 text-white cursor-pointer shadow-xl transition-transform hover:scale-[1.02] relative overflow-hidden group">
                    <div className="relative z-10 flex items-center justify-between">
                        <div><div className="bg-white/20 inline-block px-3 py-1 rounded-full text-xs font-bold mb-2">Mission 01</div><h3 className="text-3xl font-black mb-2">Outdoor Sentence</h3><p className="font-medium opacity-90">Practice intonation and speed</p></div>
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform"><Mic size={40} /></div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>
                <div onClick={() => setActiveSpeakingMode('game')} className="bg-gradient-to-r from-orange-400 to-red-400 rounded-[2rem] p-8 text-white cursor-pointer shadow-xl transition-transform hover:scale-[1.02] relative overflow-hidden group">
                    <div className="relative z-10 flex items-center justify-between">
                        <div><div className="bg-white/20 inline-block px-3 py-1 rounded-full text-xs font-bold mb-2">Mission 02</div><h3 className="text-3xl font-black mb-2">What's that noise?</h3><p className="font-medium opacity-90">Listen and identify the animals</p></div>
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:-rotate-12 transition-transform"><Music size={40} /></div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
  };

  const renderQuiz = () => {
    // Safety check for empty questions
    if (!currentQuestions || currentQuestions.length === 0) {
        return (
            <div className="w-full max-w-lg mx-auto px-4 py-20 text-center">
                <div className="bg-white rounded-[2rem] p-10 shadow-lg border-4 border-red-50">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-gray-800 mb-2">No Questions Found</h2>
                    <p className="text-gray-500 mb-8">This unit doesn't have any questions yet. Please try Grade 2 (Level P)!</p>
                    <GameButton variant="neutral" onClick={() => setView('home')} className="w-full py-4">Go Home</GameButton>
                </div>
            </div>
        );
    }

    const question = currentQuestions[currentQuestionIndex] || { question: "Loading...", options: [] };
    const themeGradient = activeLevel ? activeLevel.gradient : activeSubject.gradient;
    const themeBorder = activeLevel ? activeLevel.borderColor : activeSubject.borderColor;
    let headerLabel = activeSubject ? activeSubject.title : activeLevel.code;
    if (activeUnit) headerLabel += ` - ${activeUnit.title.split(':')[0]}`;

    return (
      <div className="w-full max-w-3xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-8">
            <GameButton variant="neutral" onClick={() => setView(activeUnit ? 'grammar_units' : (activeLevel ? 'english_menu' : 'home'))} className="px-4 py-2 text-sm">Quit</GameButton>
            <div className="px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm font-bold text-gray-600 shadow-sm border border-white/50 text-sm truncate max-w-[200px]">{headerLabel}</div>
        </div>
        <ProgressBar current={currentQuestionIndex} total={currentQuestions.length} colorClass={`bg-gradient-to-r ${themeGradient}`} />
        <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden relative">
            <div className={`h-4 w-full bg-gradient-to-r ${themeGradient}`}></div>
            <div className="p-8 md:p-10">
                {question.type === 'visual_audio' && (<div className="mb-6 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner"><SicknessAnimation type={question.visualType} /></div>)}
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-8 leading-relaxed whitespace-pre-line">{question.question}</h2>
                <div className="grid gap-4">
                    {question.options.map((option, idx) => {
                        let btnVariant = "option";
                        if (showExplanation) { if (idx === question.correctAnswer) btnVariant = "success"; else if (idx === selectedOption) btnVariant = "danger"; }
                        // Ensure option is a string or fallback to safe display
                        const displayOption = typeof option === 'string' ? option : (option.name || "Option");
                        return (
                            <GameButton key={idx} onClick={() => handleOptionClick(idx, displayOption)} disabled={showExplanation} variant={btnVariant} className={`w-full py-5 text-lg justify-start px-6 ${selectedOption === idx && !showExplanation ? 'bg-gray-100 border-gray-400' : ''}`}>
                                <span className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-sm mr-3 font-bold opacity-50 shrink-0">{String.fromCharCode(65 + idx)}</span>
                                <span className="text-left">{displayOption}</span>
                                {showExplanation && idx === question.correctAnswer && <CheckCircle2 className="ml-auto w-6 h-6 shrink-0" />}
                                {showExplanation && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="ml-auto w-6 h-6 shrink-0" />}
                                {question.type === 'visual_audio' && !showExplanation && <Volume2 className="ml-auto w-5 h-5 text-gray-300 shrink-0" />}
                            </GameButton>
                        );
                    })}
                </div>
                {showExplanation && (
                    <div className="mt-8 animate-slide-up">
                        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100 mb-6 flex gap-4">
                            <div className="bg-blue-500 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md"><BookOpen size={20} /></div>
                            <div><h4 className="font-bold text-blue-900 mb-1">Answer & Explanation</h4><p className="text-blue-800/80 font-medium">{question.explanation}</p></div>
                        </div>
                        <div className="flex justify-end"><GameButton onClick={nextQuestion} className={`px-10 py-4 text-xl bg-gradient-to-r ${themeGradient} border-b-[6px] ${themeBorder}`}>{currentQuestionIndex === currentQuestions.length - 1 ? "Finish!" : "Next"} <ArrowRight /></GameButton></div>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const total = currentQuestions.length;
    const earnedPoints = score * 10 + (score === total ? 50 : 0);
    const percentage = Math.round((score / total) * 100);
    const themeGradient = activeLevel ? activeLevel.gradient : activeSubject.gradient;
    return (
        <div className="w-full max-w-lg mx-auto px-4 text-center pb-20 pt-10 animate-fade-in">
            <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse"></div>
                <Trophy className="w-40 h-40 text-yellow-500 drop-shadow-xl relative z-10" />
                <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xl font-black px-4 py-2 rounded-full rotate-12 shadow-lg border-4 border-white">{percentage}%</div>
            </div>
            <h2 className="text-4xl font-black text-gray-800 mb-2">Awesome!</h2>
            <p className="text-gray-500 font-bold text-lg mb-8">You answered {score}/{total} correctly.</p>
            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 mb-8 transform hover:scale-105 transition-transform">
                <p className="text-yellow-800 font-bold uppercase text-xs tracking-widest mb-1">Rewards</p>
                <div className="flex items-center justify-center gap-2 text-4xl font-black text-yellow-500"><Star size={32} fill="currentColor" className="animate-spin-slow" />+{earnedPoints}</div>
            </div>
            <GameButton onClick={handleCollectPoints} className={`w-full py-4 text-lg bg-gradient-to-r ${themeGradient} border-white/20 mb-4`}><CheckCircle2 className="mr-2" /> Collect Points & Continue</GameButton>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EBF4FF] font-sans text-gray-900 flex flex-col items-center py-6 selection:bg-yellow-200 selection:text-yellow-900 relative" onClick={() => { if(showMenu) setShowMenu(false); }}>
      <Header points={points} onHomeClick={handleHomeClick} onMenuClick={(e) => { e.stopPropagation(); handleMenuClick(); }} onProfileClick={(e) => { e.stopPropagation(); setShowProfile(true); }} />
      {showMenu && <DropdownMenu onClose={() => setShowMenu(false)} onNavigate={handleNavigate} />}
      {showProfile && <UserProfileModal onClose={() => setShowProfile(false)} userPoints={points} />}

      {view === 'home' && renderHome()}
      {view === 'shop' && renderShop()}
      {view === 'leaderboard' && renderLeaderboard()}
      {view === 'levels' && renderLevels()}
      {view === 'english_menu' && renderEnglishMenu()}
      {view === 'grammar_units' && renderGrammarUnits()}
      {view === 'speaking_hub' && renderSpeakingHub()}
      {view === 'quiz' && renderQuiz()}
      {view === 'result' && renderResult()}
    </div>
  );
}