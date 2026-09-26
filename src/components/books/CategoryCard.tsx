import React from 'react';
import { Category } from '../../types';
import { useBookStore } from '../../context/BookStoreContext';
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Brain,
  Landmark,
  Code,
  Sparkles,
  Languages,
  ChevronRight
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Brain,
  Landmark,
  Code,
  Sparkles,
  Languages,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { navigateTo } = useBookStore();
  const IconComponent = iconMap[category.iconName] || BookOpen;

  const handleClick = () => {
    navigateTo('catalog', undefined, category.id);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-xl border border-stone-200/90 hover:border-amber-300/80 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-stone-100 group-hover:bg-amber-100/70 text-stone-700 group-hover:text-amber-900 flex items-center justify-center transition-colors">
          <IconComponent className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
      </div>

      <div>
        <h4 className="font-semibold text-stone-900 group-hover:text-amber-900 text-sm mb-1 transition-colors">
          {category.name}
        </h4>
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
          {category.description}
        </p>
        <span className="text-[11px] font-medium text-stone-400">
          {category.bookCount} ta kitob
        </span>
      </div>
    </div>
  );
};
