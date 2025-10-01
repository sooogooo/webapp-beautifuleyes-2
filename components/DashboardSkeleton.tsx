import React from 'react';

const Shimmer: React.FC = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-rose-100/50 to-transparent"></div>
);

const SkeletonBox: React.FC<{className?: string}> = ({ className }) => (
    <div className={`relative overflow-hidden bg-slate-200 rounded-md ${className}`}>
        <Shimmer />
    </div>
);


const DashboardSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <SkeletonBox className="h-9 w-72 mb-2" />
                <SkeletonBox className="h-5 w-48" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <SkeletonBox className="h-10 w-24" />
                <SkeletonBox className="h-10 w-28" />
                <SkeletonBox className="h-10 w-28" />
                <SkeletonBox className="h-10 w-32" />
            </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <SkeletonBox className="aspect-square w-full" />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SkeletonBox className="h-56" />
                <SkeletonBox className="h-56" />
              </div>
              <SkeletonBox className="h-full min-h-[300px]" />
            </div>
          </div>
          
          <SkeletonBox className="h-64 w-full" />
          <SkeletonBox className="h-48 w-full" />
          <SkeletonBox className="h-24 w-full" />
        </div>
    </div>
  );
};

export default DashboardSkeleton;
