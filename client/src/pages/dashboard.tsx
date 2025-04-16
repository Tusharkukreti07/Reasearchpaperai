import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import PapersList from '@/components/papers/PapersList';
import CitationGraph from '@/components/dashboard/CitationGraph';
import ResearchGoals from '@/components/dashboard/ResearchGoals';
import ChatInterface from '@/components/ai/ChatInterface';
import { useAIChat } from '@/hooks/useAIChat';
import { usePapers } from '@/hooks/usePapers';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useResearchGoals } from '@/hooks/useResearchGoals';
import { Link, useLocation } from 'wouter';
import { PaperIcon, RobotIcon, LinkIcon } from '@/lib/icons';
import { formatDate, generateRandomId } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { data: papers, isLoading: isPapersLoading } = usePapers();
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { messages, sendMessage } = useAIChat();
  const { goals, updateGoal } = useResearchGoals();
  const [, navigate] = useLocation();

  // Generate sample citation graph data
  const graphData = {
    nodes: [
      { id: "1", title: "Neural Networks Paper", group: 1 },
      { id: "2", title: "Deep Learning Methods", group: 2 },
      { id: "3", title: "Time Series Analysis", group: 2 },
      { id: "4", title: "LSTM Models", group: 2 },
      { id: "5", title: "Forecasting Applications", group: 2 }
    ],
    links: [
      { source: "1", target: "2" },
      { source: "1", target: "3" },
      { source: "1", target: "4" },
      { source: "1", target: "5" }
    ]
  };

  // Generate activities based on papers data
  const activities = papers ? papers.slice(0, 5).map((paper, index) => {
    const types = ['upload', 'ai', 'chat', 'annotation'] as const;
    const type = types[index % types.length];
    
    let title = '';
    switch (type) {
      case 'upload':
        title = `Uploaded "${paper.title}"`;
        break;
      case 'ai':
        title = `AI summarized "${paper.title}"`;
        break;
      case 'chat':
        title = `Started new chat about "${paper.title}"`;
        break;
      case 'annotation':
        title = `Added annotations to "${paper.title}"`;
        break;
    }
    
    return {
      id: generateRandomId(),
      type,
      title,
      timestamp: new Date(paper.uploadDate),
      actionUrl: `/papers/${paper.id}`,
      actionText: type === 'chat' ? 'Continue' : 'View'
    };
  }) : [];

  // Research goals for the week
  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const handleToggleGoal = (id: number, completed: boolean) => {
    updateGoal.mutate({ id, isCompleted: completed });
  };

  return (
    <Layout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Papers"
          value={isStatsLoading ? '...' : stats?.paperCount || 0}
          icon={<PaperIcon className="w-5 h-5" />}
          change={{
            value: "12% from last month",
            isPositive: true
          }}
          bgColorClass="bg-primary-50"
          textColorClass="text-primary-600"
        />
        
        <StatCard
          title="AI Queries"
          value={isStatsLoading ? '...' : stats?.queryCount || 0}
          icon={<RobotIcon className="w-5 h-5" />}
          change={{
            value: "24% from last week",
            isPositive: true
          }}
          bgColorClass="bg-purple-50"
          textColorClass="text-purple-600"
        />
        
        <StatCard
          title="Citations Extracted"
          value={isStatsLoading ? '...' : stats?.citationCount || 0}
          icon={<LinkIcon className="w-5 h-5" />}
          change={{
            value: "8% from last month",
            isPositive: true
          }}
          bgColorClass="bg-green-50"
          textColorClass="text-green-600"
        />
      </div>
      
      {/* Activity & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
        
        <div>
          <ChatInterface
            messages={messages.length > 0 ? messages : [
              {
                id: "welcome",
                content: "Hello! How can I help with your research today?",
                role: "assistant",
                timestamp: new Date()
              }
            ]}
            onSendMessage={sendMessage}
            isExternalLink={true}
            onExternalClick={() => navigate('/ai-assistant')}
          />
        </div>
      </div>
      
      {/* Recent Papers */}
      <div className="mb-8">
        <PapersList 
          papers={isPapersLoading ? [] : (papers || []).slice(0, 3).map(paper => ({
            id: paper.id,
            title: paper.title,
            authors: paper.authors || 'Unknown',
            uploadDate: new Date(paper.uploadDate),
            tags: paper.tags || []
          }))}
        />
      </div>
      
      {/* Citation Graph Preview */}
      <div className="mb-8">
        <CitationGraph
          nodes={graphData.nodes}
          links={graphData.links}
          onViewFullGraph={() => navigate('/citation-graph')}
        />
      </div>
      
      {/* Research Goals */}
      <div>
        <ResearchGoals
          goals={goals.map(goal => ({
            id: goal.id,
            description: goal.description,
            isCompleted: goal.isCompleted,
            completedDate: goal.completedDate ? new Date(goal.completedDate) : undefined,
            dueDate: goal.dueDate ? new Date(goal.dueDate) : undefined
          }))}
          startDate={startOfWeek}
          endDate={endOfWeek}
          onEditGoals={() => {/* Would implement dialog to edit goals */}}
          onToggleGoal={handleToggleGoal}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
