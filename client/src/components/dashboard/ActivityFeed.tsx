import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

type ActivityType = 'upload' | 'ai' | 'chat' | 'annotation';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: Date;
  actionUrl?: string;
  actionText?: string;
}

const getIconForActivityType = (type: ActivityType) => {
  switch (type) {
    case 'upload':
      return <i className="ri-file-text-line"></i>;
    case 'ai':
      return <i className="ri-ai-generate"></i>;
    case 'chat':
      return <i className="ri-chat-1-line"></i>;
    case 'annotation':
      return <i className="ri-bookmark-line"></i>;
    default:
      return <i className="ri-file-text-line"></i>;
  }
};

const getBgColorForActivityType = (type: ActivityType) => {
  switch (type) {
    case 'upload':
      return 'bg-primary-50 text-primary-600';
    case 'ai':
      return 'bg-purple-50 text-purple-600';
    case 'chat':
      return 'bg-green-50 text-green-600';
    case 'annotation':
      return 'bg-primary-50 text-primary-600';
    default:
      return 'bg-primary-50 text-primary-600';
  }
};

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="p-2 hover:bg-neutral-50 rounded-lg mb-2 transition">
      <div className="flex items-start">
        <div className={`p-2 rounded-lg mr-4 ${getBgColorForActivityType(activity.type)}`}>
          {getIconForActivityType(activity.type)}
        </div>
        <div>
          <p className="font-medium text-sm">{activity.title}</p>
          <div className="flex items-center text-xs text-neutral-500 mt-1">
            <span>{formatDate(activity.timestamp)}</span>
            {activity.actionUrl && (
              <>
                <span className="mx-2">•</span>
                <a href={activity.actionUrl} className="text-primary-600 hover:underline cursor-pointer">
                  {activity.actionText || 'View'}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  maxHeight?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  title = "Recent Activity",
  maxHeight = "400px"
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-neutral-200">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      <CardContent className="p-4" style={{ maxHeight, overflowY: 'auto' }}>
        {activities.length > 0 ? (
          activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        ) : (
          <p className="text-neutral-500 text-sm text-center py-4">No recent activity</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
