
import React, { useState, useMemo } from 'react';
import { Hospital, NeedsAssessmentTopic } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface NeedsAssessmentManagerProps {
  hospital: Hospital;
  onUpdateTopics: (month: string, topics: NeedsAssessmentTopic[]) => void;
  onBack: () => void;
}

const PERSIAN_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const NeedsAssessmentManager: React.FC<NeedsAssessmentManagerProps> = ({ hospital, onUpdateTopics, onBack }) => {
    const [selectedMonth, setSelectedMonth] = useState<string>(PERSIAN_MONTHS[0]);
    const [newTopicTitle, setNewTopicTitle] = useState('');

    const topicsForSelectedMonth = useMemo(() => {
        return hospital.needsAssessments?.find(na => na.month === selectedMonth)?.topics || [];
    }, [hospital.needsAssessments, selectedMonth]);

    const handleAddTopic = () => {
        if (!newTopicTitle.trim()) {
            alert('عنوان موضوع نمی‌تواند خالی باشد.');
            return;
        }
        const newTopic: NeedsAssessmentTopic = {
            id: Date.now().toString(),
            title: newTopicTitle.trim(),
            responses: [],
        };
        const updatedTopics = [...topicsForSelectedMonth, newTopic];
        onUpdateTopics(selectedMonth, updatedTopics);
        setNewTopicTitle('');
    };

    const handleDeleteTopic = (topicId: string) => {
        if (window.confirm('آیا از حذف این موضوع و تمام نظرات ثبت‌شده برای آن مطمئن هستید؟')) {
            const updatedTopics = topicsForSelectedMonth.filter(t => t.id !== topicId);
            onUpdateTopics(selectedMonth, updatedTopics);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">مدیریت نیازسنجی آموزشی</h1>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <label htmlFor="month-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        انتخاب ماه برای تعریف موضوعات:
                    </label>
                    <select
                        id="month-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {PERSIAN_MONTHS.map(month => (<option key={month} value={month}>{month}</option>))}
                    </select>
                </div>
                
                <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-4">افزودن موضوع جدید برای ماه <span className="text-amber-500">{selectedMonth}</span></h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                            placeholder="مثال: دوره آموزشی احیای قلبی ریوی پیشرفته"
                            className="flex-grow px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleAddTopic}
                            className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                        >
                            <PlusIcon className="w-5 h-5" />
                            افزودن
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4">موضوعات و نظرات ثبت‌شده برای <span className="text-amber-500">{selectedMonth}</span></h3>
                    {topicsForSelectedMonth.length === 0 ? (
                         <p className="text-center py-8 text-slate-400">هیچ موضوعی برای این ماه تعریف نشده است.</p>
                    ) : (
                         <div className="space-y-6">
                          {topicsForSelectedMonth.map(topic => (
                              <div key={topic.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center rounded-t-lg">
                                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{topic.title}</h4>
                                    <button onClick={() => handleDeleteTopic(topic.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-full">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    {topic.responses.length === 0 ? (
                                        <p className="text-sm text-slate-400">هنوز نظری برای این موضوع ثبت نشده است.</p>
                                    ) : (
                                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-4">
                                            {topic.responses.map((res, index) => (
                                                <li key={index} className="text-sm border-r-2 border-slate-200 dark:border-slate-600 pr-3">
                                                    <p className="font-semibold text-slate-700 dark:text-slate-300">{res.staffName}:</p>
                                                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{res.response}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NeedsAssessmentManager;